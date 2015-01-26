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
            Meteor.checkRequest(this, 'GET');
            checkCollectionEntryExists(this, { 'collection': 'Projects', 'id' : this.params._id });
            // create project object from mongo data
            var projectId = this.params._id;
            var project = Projects.findOne({_id: projectId});

            project.visualLink = Parameters.api_public_endpoint+'/api/1.0/projects/'+project._id+'/render';
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
            Meteor.checkRequest(this, 'GET');
            var query = buildMongoQuery(this.request.query);
            var filters = buildMongoFilters(this.params.query);
            var projects = Projects.find(query, filters).fetch();
            _.each(projects, function(project) {
                project.visualLink = Parameters.api_public_endpoint+'/api/1.0/projects/'+project._id+'/render';
            });

            // set response
            var headers = {'Content-type': 'application/json'};
            this.response.writeHead(200, headers);
            this.response.end(JSON.stringify(projects));
        }
    });

    /**
     * Count projects
     * Method GET
     */
    this.route('apiProjectCount', {
        where: 'server',
        path: '/api/1.0/projects_count',
        action: function() {
            Meteor.checkRequest(this, 'GET');
            var query = buildMongoQuery(this.request.query);
            var filters = buildMongoFilters(this.params.query);
            var count = Projects.find(query, filters).count();
            var response = { projects_count : count };
            // set response
            var headers = {'Content-type': 'application/json'};
            this.response.writeHead(200, headers);
            this.response.end(JSON.stringify(response));
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
            Meteor.checkRequest(action, 'GET');
            checkCollectionEntryExists(this, { 'collection': 'Projects', 'id' : this.params._id });
            // render the project
            var exec = Npm.require('child_process').exec;
            var renderInfo = getRenderInfo(this.params);
            console.log(renderInfo.cmd);
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
                        if (err) {
                            action.response.writeHead(500, {'Content-Type': 'text/html'});
                            action.response.end('Internal server error');
                        }
                        //set the response
                        if (action.params.mode == 'base64') {
                            fs.writeFile(renderInfo.filePath, data, function(err) {});
                            var base64Image = new Buffer(data, 'binary').toString('base64');
                            action.response.writeHead(200, {'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*'});
                            action.response.end('data:image/'+renderInfo.format+';base64,'+base64Image);
                        } else {
                            action.response.writeHead(200, {'Content-Type': 'image/'+renderInfo.format, 'Access-Control-Allow-Origin': '*'});
                            action.response.end(data);
                        }
                    });
                }
            );
        }
    });

    // TODO Quick and dirty, refactor code
    /**
     * Render the insight of a project
     * Method GET
     */
    this.route('apiProjectRenderInsight', {
        where: 'server',
        path: '/project/:_id/insight',
        action: function() {
            action = this;
            Meteor.checkRequest(action, 'GET');
            checkCollectionEntryExists(this, { 'collection': 'Projects', 'id' : this.params._id });
            // render the project
            var exec = Npm.require('child_process').exec;
            var url = Parameters.api_public_endpoint+'/project/'+this.params._id+'/raw';
            var filePath = process.env.PWD+'/.uploads/'+this.params._id+'.jpg';
            var cmd = 'phantomjs '+process.env.PWD+'/public/scripts/phantomjs-screenshot.js '+url+' '+filePath+' jpeg 1 40';
            exec(cmd,
                function (error, stdout, stderr) {
                    console.log('stdout: ' + stdout);
                    console.log('stderr: ' + stderr);
                    if (error !== null) {
                        console.log('exec error: ' + error);
                    }
                    var fs = Npm.require('fs');
                    fs.readFile(filePath, function(err, data) {
                        // Fail if the file can't be read
                        if (err) {
                            action.response.writeHead(500, {'Content-Type': 'text/html'});
                            action.response.end('Internal server error');
                        }
                        //set the response
                        action.response.writeHead(200, {'Content-Type': 'image/jpeg', 'Access-Control-Allow-Origin': '*'});
                        action.response.end(data);
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
            Meteor.checkRequest(this, 'POST', requiredParameters);
            checkCollectionEntryExists(this, { 'collection': 'Projects', 'id' : this.params._id });
            var data = this.request.body;
            // check if the user already voted
            var vote = Votes.findOne({'projectId': this.params._id, 'userId': data.userId});
            if (vote) {
                this.response.writeHead(409, {'Content-Type': 'text/html'});
                this.response.end("The user "+data.userId+" already voted for the project "+this.params._id);
            } else {
                Votes.insert({
                    'userId': data.userId,
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
            Meteor.checkRequest(this, 'PUT', requiredParameters);
            checkCollectionEntryExists(this, { 'collection': 'Projects', 'id' : this.params._id });
            var data = this.request.body;
            // update sales number
            Projects.update(
                this.params._id,
                { $set: { sales: data.sales } }
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
            console.log(this.request.body);
            var requiredParameters = ['mail'];
            Meteor.checkRequest(this, 'POST', requiredParameters);
            var email = this.request.body.mail;
            var user = Meteor.users.findOne({'emails.address': email});
            if (user) {
                this.response.writeHead(409, {'Content-Type': 'text/html'});
                this.response.end("The user " + email + " already exist.");
            } else {
                var userId = Accounts.createUser({
                    'email': email,
                    'profile': {
                        isAdmin: false
                    }
                });
                this.response.writeHead(200, {'Content-type': 'application/json'});
                this.response.end(JSON.stringify({'userId': userId}));
            }
        }
    });


    /*********************/
    /***METHODS FOR API***/
    /*********************/

    /**
     * Check if a collection entry exists
     *
     * @param mongoEntry : a mongo collections and the Id to be found (ex: { 'collection': 'Project', 'id' : '12d12sq1se5f41sed' }
     * @return a 404 response, or nothing
     */
    function checkCollectionEntryExists(action, mongoEntry) {
        if (mongoEntry) {
            var mongoCollection = null;
            if (mongoEntry.collection == 'Projects') {
                mongoCollection = Projects.findOne(mongoEntry.id);
            }
            if (mongoEntry.collection == 'Users') {
                mongoCollection = Users.findOne(mongoEntry.id);
            }
            if (!mongoCollection) {
                action.response.writeHead(404, {'Content-Type': 'text/html'});
                action.response.end(mongoEntry.collection+" "+action.params._id+" was not found");
            }
        }
    }

    /**
     * Build a mongo query from request parameters
     * 
     * @param : the query from the request
     * @return : the mongo query
     */
    function buildMongoQuery(query) {
        var builtQuery = {
            // TODO uncomment if needed
            /*visibility: 'public',
            publicationState: 'published',*/
            'isModel': { $exists: false }
        };
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
                    builtQuery[field] = { '$in': parametersForField };
                }
            }
        }

        return builtQuery;
    }

    /**
     * Build mongo filters from request parameters
     * 
     * @params : the query parameters
     * @return : the mongo query filter
     */
    function buildMongoFilters(params) {
        var sort_order = getSort(params);
        var offset = params.offset ? params.offset : 0;
        var limit = params.limit ? params.limit : null;

        if (limit || offset) {
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
     * 
     * @params : the query parameters
     * @return : the mongo sort object for the query filters
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
            order = -1;
        }
        sort[field] = order;

        return sort;
    }

    /**
     * Get infos used to render an image from a project with the query parameters
     * 
     * @params : the query parameters
     * @return : the info
     */
    function getRenderInfo(params) {

        var partToRenderMap = {
            'title': 'title-raw',
            'legend': 'legend-raw',
            'map': 'map-raw'
        };

        var partToRender = params.query.part;
        
        var availableParts = ['title', 'legend', 'map'];
        if (availableParts.indexOf(partToRender) == -1) {
            partToRender = 'raw';
        } else {
            partToRender = partToRenderMap[partToRender];
        }

        var format = params.query.format;
        var availableFormats = ['png', 'jpeg', 'jpg', 'pdf', 'gif'];
        if (availableFormats.indexOf(format) == -1) {
            format = 'jpeg';
        }
        console.log(format);
        var projectId = params._id;
        var url = Parameters.api_public_endpoint+'/project/'+projectId+'/'+partToRender;
        var filePath = process.env.PWD+'/.uploads/'+projectId+'.'+format;
        var zoom = params.query.zoom ? params.query.zoom : 1;
        var quality = params.query.quality ? params.query.quality : 100;
        var cmd = 'phantomjs '+process.env.PWD+'/public/scripts/phantomjs-screenshot.js '+url+' '+filePath+' '+format+' '+zoom+' '+quality;
        if (params.query.mode) {
            cmd += params.query.mode;
        }

        return {
            'cmd': cmd,
            'filePath': filePath,
            'format': format
        };
    }
});
