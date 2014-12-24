Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'notFound'
});

// Known bug : https://github.com/EventedMind/iron-router/issues/1003
if (Meteor.isServer) {
    Router.onBeforeAction(Iron.Router.bodyParser.urlencoded({
        extended: false
    }));
}

// Test before actions if the user is logged in
var BeforeHooks = {
    isLoggedIn: function() {
        if (!Meteor.userId()) {
          Router.go('notAllowed');
        } else {
            this.next();
        }
    }
}

Router.before(BeforeHooks.isLoggedIn, {only: ['projects', 'projectShow']});

ProjectsListController = RouteController.extend({
    template: 'projectsList',
    waitOn: function() {
        return  [
            Meteor.subscribe('projects'),
            Meteor.subscribe('itemCategories'),
            Meteor.subscribe('items'),
            Meteor.subscribe('images')
        ];
    }
});

Router.map(function() {

    /*************************/
    /*****NOT FOUND ROUTE*****/
    /*************************/

    this.route('notFound', {
        path: '/not-found',
        template: 'notFound'
    });

    /***************************/
    /**** NOT ALLOWED ROUTE ****/
    /***************************/

    this.route('notAllowed', {
        path: '/not-allowed',
        template: 'notAllowed'
    });

    /**********************/
    /***** LOGIN ROUTE ****/
    /**********************/

    this.route('login', {
        path: '/login/:_userId',
        onBeforeAction: function() {
            Meteor.autoLogin(this.params._userId, function(err) {
                if (err) {
                    Router.go('notAllowed');
                } else {
                    Router.go('projects');
                }
            });
        }
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

    this.route('projectEditModel', {
        path: '/project/:_id/edit-model',
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
                Meteor.subscribe('items'),
                Meteor.subscribe('images')
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
                Meteor.subscribe('items', this.params._id),
                Meteor.subscribe('images')
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

    this.route('projectTitleRaw', {
        path: '/project/:_id/title-raw',
        waitOn: function() {
            return [
                Meteor.subscribe('singleProject', this.params._id),
                Meteor.subscribe('itemCategories', this.params._id),
                Meteor.subscribe('items', this.params._id),
                Meteor.subscribe('images')
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

    this.route('projectMapRaw', {
        path: '/project/:_id/map-raw',
        waitOn: function() {
            return [
                Meteor.subscribe('singleProject', this.params._id),
                Meteor.subscribe('itemCategories', this.params._id),
                Meteor.subscribe('items', this.params._id),
                Meteor.subscribe('images')
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

    this.route('projectLegendRaw', {
        path: '/project/:_id/legend-raw',
        waitOn: function() {
            return [
                Meteor.subscribe('singleProject', this.params._id),
                Meteor.subscribe('itemCategories', this.params._id),
                Meteor.subscribe('items', this.params._id),
                Meteor.subscribe('images')
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

    /*********************************/
    /***ROUTES FOR ITEMS CATEGORIES***/
    /*********************************/

    this.route('itemCategoryCreate', {
        path: '/project/:_id/item-category/new',
        waitOn: function() {
            return [
                Meteor.subscribe('singleProject', this.params._id)
            ];
        },
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
});
