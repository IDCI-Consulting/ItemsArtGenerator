Router.configure({
    layoutTemplate: 'layout',
});

ProjectsListController = RouteController.extend({
    template: 'projectsList',
    waitOn: function() {
        return Meteor.subscribe('projects');
    }
});

Router.map(function() {

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
                Meteor.subscribe('itemCategories', this.params._id),
                Meteor.subscribe('items', this.params._id)
            ];
        },
        data: function() {
            return Projects.findOne(this.params._id);
        },
<<<<<<< HEAD
        yieldTemplates: {
          'header': {to: 'header'}
        }
=======
    yieldTemplates: {
      'header': {to: 'header'}
    }
>>>>>>> 69ce0dcde65c24a21891f381136bca9655c37dc4
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
            return Projects.findOne(this.params._id);
        }
    });

    this.route('projectCreate', {
        path: '/project/new'
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
    /****ROUTES FOR API***/
    /*********************/

    // TODO : check visibility and publicationState

    this.route('apiSingleJsonItem', {
        where: 'server',
        path: '/api/project.json/:_id',
        action: function() {
            // create project object from mongo data
            var projectId = this.params._id;
            var project = Projects.findOne(projectId);
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

    this.route('apiMultipleItems', {
        where: 'server',
        path: '/api/projects.json',
        action: function() {
            var projects = Projects.find().fetch();
            _.each(projects, function(project){
                project.previewLink = Meteor.absoluteUrl()+'api/project.png/'+project._id;
            });

            // set response
            var headers = {'Content-type': 'application/json'};
            this.response.writeHead(200, headers);
            this.response.end(JSON.stringify(projects));
        }
    });

    this.route('apiSingleItem', {
        where: 'server',
        path: '/api/project.:format/:_id',
        action: function() {
            var url = Meteor.absoluteUrl()+'project/'+this.params._id+'/show';
            var filePath = process.env.PWD+'/.uploads/'+this.params._id+'.'+this.params.format;
            var exec = Npm.require('child_process').exec;
            var action = this;
            var cmd = '/usr/lib/phantomjs/phantomjs '+process.env.PWD+'/public/scripts/phantomjs-screenshot.js '+url+' '+filePath;
            console.log(filePath);
            console.log(cmd);
            exec(cmd,
                function (error, stdout, stderr) {
                    console.log('stdout: ' + stdout);
                    console.log('stderr: ' + stderr);
                    if (error !== null) {
                        console.log('exec error: ' + error);
                    }
                    var fs = Npm.require('fs');

                    fs.readFile(filePath, function(err, data) {
                        if (err) throw err; // Fail if the file can't be read.
                        action.response.writeHead(200, {'Content-Type': 'image/jpeg'});
                        action.response.end(data);
                    });
                }
            );
        }
    });
});
