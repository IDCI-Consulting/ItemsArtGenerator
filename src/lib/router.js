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
            Meteor.subscribe('items'),
            Meteor.subscribe('users')
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

    this.route('projectCreateModel', {
        path: '/project/new-model',
        waitOn: function() {
            return  [
                Meteor.subscribe('projects')
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

    /**********************/
    /***ROUTES FOR LOGIN***/
    /**********************/

    /**
     * Create a user
     * Method POST
     */
    this.route('userLogin', {
        where: 'server',
        path: '/editor',
        action: function() {
            Meteor.checkRequest(this, 'GET', null, ['x-userid']);
            var userId = this.request.headers['x-userid'];
            var user = Meteor.users.findOne(userId);
            if (!user) {
                this.response.writeHead(403, {'Content-Type': 'text/html'});
                this.response.end('You are not allowed to access this page');
            } else {
                console.log(Meteor.call('setUserId', userId));
            }
        }
    });
});
