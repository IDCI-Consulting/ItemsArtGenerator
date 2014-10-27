Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'notFound'
});

ProjectsListController = RouteController.extend({
    template: 'projectsList',
    waitOn: function() {
        return  [
            Meteor.subscribe('projects'),
            Meteor.subscribe('itemCategories'),
            Meteor.subscribe('items')
        ];
    }
});

Router.map(function() {

    /*************************/
    /*****NOT FOUND ROUTE*****/
    /*************************/

    this.route('notFound', {
        path: '/404',
        template: 'notFound'
    });

    /*************************/
    /***ROUTES FOR PROJECTS***/
    /*************************/

    this.route('projects', {
        path: '/',
        controller: ProjectsListController
    });

    this.route('projectEdit', {
        path: '/project/:_id/edit',
        waitOn: function() {
            return [
                Meteor.subscribe('singleProject', this.params._id)
            ]
        },
        data: function() {
            return Projects.findOne(this.params._id);
        }
    });

    this.route('projectShow', {
        path: '/project/:_id/show',
        waitOn: function() {
            return [
                Meteor.subscribe('singleProject', this.params._id),
                Meteor.subscribe('itemCategories'),
                Meteor.subscribe('items')
            ];
        },
        data: function() {
            return Projects.findOne(this.params._id);
        },
        yieldTemplates: {
          'header': {to: 'header'}
        }
    });

    this.route('projectRaw', {
        path: '/project/:_id/raw',
        waitOn: function() {
            return [
                Meteor.subscribe('singleProject', this.params._id),
                Meteor.subscribe('itemCategories', this.params._id),
                Meteor.subscribe('items', this.params._id)
            ];
        },
        data: function() {
            if (this.ready()) {
                var project = Projects.findOne(this.params._id);
                if (!project) {
                    this.redirect('/404');
                } else {
                    return project;
                }
            }
        }
    });

    this.route('projectCreate', {
        path: '/project/new',
        waitOn: function() {
            return  [
                Meteor.subscribe('projects'),
                Meteor.subscribe('itemCategories'),
                Meteor.subscribe('items')
            ];
        }
    });

    /*******************************/
    /***ROUTES FOR ITEMCATEGORIES***/
    /*******************************/

    this.route('itemCategoryCreate', {
        path: '/project/:_id/item-category/new',
        data: function() {
            return {
                'projectId': this.params._id
            };
        }
    });

    this.route('itemCategoryEdit', {
        path: '/project/:projectId/item-category/:_id/edit',
        waitOn: function() {
            return [
                Meteor.subscribe('singleItemCategory', this.params._id)
            ];
        },
        data: function() {
            return ItemCategories.findOne(this.params._id);
        }
    });

    /**********************/
    /***ROUTES FOR ITEMS***/
    /**********************/

    this.route('itemCreate', {
        path: '/project/:_id/item/new',
        waitOn: function() {
            return Meteor.subscribe('itemCategories');
        },
        data: function() {
            return {
                'projectId': this.params._id
            };
        }
    });

    this.route('itemEdit', {
        path: '/project/:projectId/item/:_id/edit',
        waitOn: function() {
            return [
                Meteor.subscribe('singleItem', this.params._id),
                Meteor.subscribe('itemCategories', this.params._id)
            ];
        },
        data: function() {
            return Items.find(this.params._id);
        }
    });

    /*********************/
    /***ROUTES FOR USER***/
    /*********************/

    this.route('userCreate', {
        path: '/user/new'
    });

    this.route('userEdit', {
        path: '/user/:_id/edit',
        waitOn: function() {
            return [
                Meteor.subscribe('singleUser', this.params._id)
            ]
        },
        data: function() {
            return Users.findOne(this.params._id);
        }
    });

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
            var project = Projects.findOne({_id:projectId, visibility:'public', publicationState:'published'});
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
            console.log(this.request.query);
            checkRequest(this, 'GET');
            var query = buildQuery(this.params);
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
     * Build query from request parameters
     */
    function buildQuery(params) {
        // Dans des versions prochaines, utiliser directement les paramètres
        var query = {
            /*visibility:'public',
            publicationState:'published'*/
        }


        return query;
    }

    /**
     * Build filters from request parameters
     */
    function buildFilters(params) {
        console.log(params);
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

    //TODO filter only public? visible?

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
