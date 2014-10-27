Router.map(function() {

    /********************/
    /***ROUTES FOR API***/
    /********************/

    // TODO : check visibility and publicationState

    this.route('apiSingleJsonItem', {
        where: 'server',
        path: '/api/1.0/project.json/:_id',
        action: function() {
            // create project object from mongo data
            var projectId = this.params._id;
            var project = Projects.findOne({_id: projectId, visibility:'public', publicationState:'published'});
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

    this.route('apiProjects', {
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
    this.route('apiRender', {
        where: 'server',
        path: '/api/1.0/projects/:_id/render',
        action: function() {
            action = this;
            checkRequest(action, 'GET', this.params._id);
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

    /*********************/
    /***METHODS FOR API***/
    /*********************/

    /**
     * Check if the request is valid
     * 
     * @action: the action being processed
     * @param method
     * @param projectId
     */
    function checkRequest(action, method, projectId) {
        // throw a 405 if project not found
        if (method && action.request.method != method) {
            action.response.writeHead(405, {'Content-Type': 'text/html'});
            action.response.end("Method "+action.request.method+" not allowed");
        }
        // throw a 404 if project not found
        if (projectId) {
            var project = Projects.findOne(projectId);
            if (!project) {
                action.response.writeHead(404, {'Content-Type': 'text/html'});
                action.response.end("project "+action.params._id+" was not found");
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
