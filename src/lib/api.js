Router.map(function() {

    /********************/
    /***ROUTES FOR API***/
    /********************/

    /*--------------------*/
    /*---Project routes---*/
    /*--------------------*/

    /**
     * Give a project details
     * Method GET
     */
    this.route('apiProjectDetails', {
        where: 'server',
        path: '/api/1.0/projects/:_id',
        action: function() {
            checkRequest(this, 'GET');
            checkCollectionEntryExists(this, { 'collection': 'Projects', 'id' : this.params._id });
            // create project object from mongo data
            var projectId = this.params._id;
            var project = Projects.findOne({_id: projectId});

            project.visual_link = Meteor.absoluteUrl()+'api/1.0/projects/'+project._id+'/render';
            project.categories = ItemCategories.find({'projectId':projectId}).fetch();
            _.each(project.categories, function(categorie){
                delete categorie.projectId;
            });
            project.items = Items.find({'projectId':projectId}).fetch();
            _.each(project.items, function(item){
                delete item.projectId;
            });

            // set response
            var headers = {'Content-type': 'application/json'};
            this.response.writeHead(200, headers);
            this.response.end(JSON.stringify(project));
        }
    });

    /**
     * List all projects
     * Method GET
     */
    this.route('apiProjectList', {
        where: 'server',
        path: '/api/1.0/projects',
        action: function() {
            checkRequest(this, 'GET');
            var query = buildQuery(this.request.query);
            var filters = buildFilters(this.params);
            var projects = Projects.find(query, filters).fetch();
            _.each(projects, function(project) {
                project.visual_link = Meteor.absoluteUrl()+'api/1.0/projects/'+project._id+'/render';
            });

            // set response
            var headers = {'Content-type': 'application/json'};
            this.response.writeHead(200, headers);
            this.response.end(JSON.stringify(projects));
        }
    });

    /**
     * Render a project as png, jpg, base64 or (pdf)
     * Method GET
     */
    this.route('apiProjectRender', {
        where: 'server',
        path: '/api/1.0/projects/:_id/render',
        action: function() {
            action = this;
            checkRequest(action, 'GET');
            checkCollectionEntryExists(this, { 'collection': 'Projects', 'id' : this.params._id });
            // render the project
            var exec = Npm.require('child_process').exec;
            var renderInfo = getRenderInfo(this.params);
            exec(renderInfo.cmd,
                function (error, stdout, stderr) {
                    console.log('stdout: ' + stdout);
                    console.log('stderr: ' + stderr);
                    if (error !== null) {
                        console.log('exec error: ' + error);
                    }
                    var fs = Npm.require('fs');
                    fs.readFile(renderInfo.filePath, function(err, data) {
                        // Fail if the file can't be read
                        if (err) throw err;
                        //set the response
                        if (action.params.mode == 'base64') {
                            fs.writeFile(renderInfo.filePath, data, function(err) {});
                            var base64Image = new Buffer(data, 'binary').toString('base64');
                            action.response.writeHead(200, {'Content-Type': 'text/html'});
                            action.response.end('<img src="data:image/'+renderInfo.format+';base64,'+base64Image+'">');
                        } else {
                            action.response.writeHead(200, {'Content-Type': 'image/jpeg'});
                            action.response.end(data);
                        }
                    });
                }
            );
        }
    });

    /**
     * Vote for a project
     * Method POST
     */
    this.route('apiProjectIncrementVote', {
        where: 'server',
        path: '/api/1.0/projects/:_id/vote',
        action: function() {
            var requiredParameters = ['userId'];
            checkRequest(this, 'POST', requiredParameters);
            checkCollectionEntryExists(this, { 'collection': 'Projects', 'id' : this.params._id });
            var data = this.request.body;
            // check if the user already voted
            var vote = Votes.findOne({'projectId': this.params._id, 'userId': data['userId']});
            if (vote) {
                this.response.writeHead(409, {'Content-Type': 'text/html'});
                this.response.end("The user "+data['userId']+" already voted for the project "+this.params._id);
            } else {
                Votes.insert({
                    'userId': data['userId'],
                    'projectId': this.params._id,
                    'createdAt': new Date().getTime()
                });
                Projects.update(
                    this.params._id,
                    { $inc: { votes: 1 } }
                );
                this.response.writeHead(201, {'Content-Type': 'text/html'});
                this.response.end();
            }
        }
    });

    /**
     * Update the number of sales for a project
     * Method PUT
     */
    this.route('apiProjectUpdateSales', {
        where: 'server',
        path: '/api/1.0/projects/:_id/sales',
        action: function() {
            var requiredParameters = ['sales'];
            checkRequest(this, 'PUT', requiredParameters);
            checkCollectionEntryExists(this, { 'collection': 'Projects', 'id' : this.params._id });
            var data = this.request.body;
            // update sales number
            Projects.update(
                this.params._id,
                { $set: { sales: data['sales'] } }
            );
            this.response.writeHead(204, {'Content-Type': 'text/html'});
            this.response.end();
        }
    });

    /*-----------------*/
    /*---User routes---*/
    /*-----------------*/

    /**
     * Create a user
     * Method POST
     */
    this.route('apiUserCreate', {
        where: 'server',
        path: '/api/1.0/users/',
        action: function() {
            var requiredParameters = ['mail'];
            checkRequest(this, 'POST', requiredParameters);
            var mail = this.request.body['mail'];
            var user = Users.findOne({'mail': mail});
            if (user) {
                this.response.writeHead(409, {'Content-Type': 'text/html'});
                this.response.end("The user "+mail+" already exist.");
            } else {
                Users.insert({
                    'mail': mail,
                    'createdAt': new Date().getTime()
                });
                this.response.writeHead(201, {'Content-Type': 'text/html'});
                this.response.end();
            }
        }
    });

    /**
     * List a user projects
     * Method GET
     */
    this.route('apiUserProjectsList', {
        where: 'server',
        path: '/api/1.0/users/:_id/projects',
        action: function() {
            checkRequest(this, 'GET');
            
        }
    });

    /*********************/
    /***METHODS FOR API***/
    /*********************/

    /**
     * Check if the request is valid
     * 
     * @param action: the action being processed, which contains the request
     * @param method : the request method to be checked
     * @param dataArray : an array of data whose elements must be in the request data (for Post, PUt method for example)
     */
    function checkRequest(action, method, dataArray, mongoEntry) {
        // throw a 405 if project not found
        if (method && action.request.method != method) {
            action.response.writeHead(405, {'Content-Type': 'text/html'});
            action.response.end("Method "+action.request.method+" not allowed");
        }
        // throw a 400 (bad request) if some required parameters are missing
        if (dataArray) {
            var missingParameter = true;
            for (var i = 0; i < dataArray.length; i++) {
                if (method == 'POST' || method == 'PUT') {
                    if (!action.request.body[dataArray[i]]) {
                        action.response.writeHead(400, {'Content-Type': 'text/html'});
                        action.response.end("The parameter "+dataArray[i]+" is missing");
                    }
                }
            }
        }
    }

    /**
     * Check if an collection entry exists
     *
     * @param mongoEntry : a mongo collections and the Id to be found (ex: { 'collection': 'Project', 'id' : '12d12sq1se5f41sed' }
     */
    function checkCollectionEntryExists(action, mongoEntry) {
        if (mongoEntry) {
            if (mongoEntry['collection'] == 'Projects') {
                var mongoCollection = Projects.findOne(mongoEntry['id']);
            }
            if (mongoEntry['collection'] == 'Users') {
                var mongoCollection = Users.findOne(mongoEntry['id']);
            }
            if (!mongoCollection) {
                action.response.writeHead(404, {'Content-Type': 'text/html'});
                action.response.end(mongoEntry['collection']+" "+action.params._id+" was not found");
            }
        }
    }

    /**
     * Build query from request parameters
     */
    function buildQuery(query) {
        var builtQuery = {
            // TODO uncomment if needed
            /*visibility:'public',
            publicationState:'published'*/
        }
        var fields = {
            // 'query_parameter': 'matching_project_field'
            'tags': 'tags',
            'authors': 'authors',
            'types' : 'type'
        };

        for (var parameter in fields) {
            if (fields.hasOwnProperty(parameter)) {
                // hasOwnProperty is used to check if your target really have that property, rather than have it inherited from its prototype
                var field = fields[parameter];
                var parametersForField = query[parameter];
                // if the query has a parameter we can find in fields
                if (query[parameter]) {
                    builtQuery[field] = { '$in': parametersForField }
                }
            }
        }

        return builtQuery;
    }

    /**
     * Build filters from request parameters
     */
    function buildFilters(params) {
        var sort_order = getSort(params);
        var offset = params.offset ? params.offset : 0;
        var limit = params.limit ? params.limit : null;

        if (limit) {
            return {
                'sort': sort_order,
                'skip': parseInt(offset),
                'limit': parseInt(limit)
            };
        }

        return {
            'sort': sort_order,
        };
    }

    /**
     * Get sort from request parameters
     */
    function getSort(params) {
        var sort = {};
        // return empty object if no sort field is set
        var field = params.sort_field;
        if (!field) {
            return sort;
        }
        // set order
        var requestOrder = params.sort_order;
        var order = 1;
        if (requestOrder == 'desc' || requestOrder == 'DESC') {
            order = -1
        }
        sort[field] = order;

        return sort;
    }

    /**
     * Create the command from route parameters
     */
    function getRenderInfo(params) {
        var format = params.format;
        var availableFormats = ['png', 'jpeg', 'jpg', 'pdf', 'gif'];
        if (availableFormats.indexOf(format) == -1) {
            format = 'jpeg';
        }
        var projectId = params._id;
        var url = Meteor.absoluteUrl()+'project/'+projectId+'/raw';
        var filePath = process.env.PWD+'/.uploads/'+projectId+'.'+format;
        var cmd = 'phantomjs '+process.env.PWD+'/public/scripts/phantomjs-screenshot.js '+url+' '+filePath+' ';
        if (params.mode) {
            cmd += params.mode;
        }

        return {
            'cmd': cmd,
            'filePath': filePath,
            'format': format
        }
    }
});
