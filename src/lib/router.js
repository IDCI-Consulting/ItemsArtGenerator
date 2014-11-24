Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'notFound'
});

ProjectsListController = RouteController.extend({
    template: 'projectsList',
    onBeforeAction: function() {
        var response = Meteor.autoLogin(this.params.userId);
        this.next();
    },
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
        path: '/404',
        template: 'notFound'
    });

    /*************************/
    /***ROUTES FOR PROJECTS***/
    /*************************/

    this.route('projects', {
        path: '/:userId',
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
});
