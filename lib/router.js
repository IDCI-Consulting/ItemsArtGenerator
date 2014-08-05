Router.configure({
    layoutTemplate: 'layout'
});

ProjectsListController = RouteController.extend({
    template: 'projectsList',
    waitOn: function() {
        return Meteor.subscribe('projects');
    }
});

ItemsCategoriesListController = RouteController.extend({
    template: 'itemsCategoriesList',
    waitOn: function() {
        return Meteor.subscribe('itemsCategories');
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
        data: function() { return Projects.findOne(this.params._id); }
    });

    this.route('projectShow', {
        path: '/project/:_id/show',
        waitOn: function() {
            return [
                Meteor.subscribe('singleProject', this.params._id),
                Meteor.subscribe('itemsCategories', this.params._id),
                Meteor.subscribe('items', this.params._id)
            ];
        },
        data: function() { return Projects.findOne(this.params._id); }
    });

    this.route('projectCreate', {
        path: '/project/new'
    });


    /********************************/
    /***ROUTES FOR ITEMSCATEGORIES***/
    /********************************/

    this.route('itemCategoryCreate', {
        path: '/project/:_id/item-category/new',
        data: function() { return this.params._id; }
    });

    this.route('itemCategoryEdit', {
        path: '/project/:projectId/item-category/:_id/edit',
        waitOn: function() {
            return [
                Meteor.subscribe('singleItemCategory', this.params._id)
            ];
        },
        data: function() { return ItemsCategories.findOne(this.params._id); }
    });

    this.route('itemCategoryShow', {
        path: '/item-category/:_id/show',
        waitOn: function() {
            return [
                Meteor.subscribe('singleItemCategory', this.params._id),
                Meteor.subscribe('items', this.params._id)
            ];
        },
        data: function() { return ItemsCategories.findOne(this.params._id); }
    });

    /**********************/
    /***ROUTES FOR ITEMS***/
    /**********************/


    this.route('itemCreate', {
        path: '/project/:_id/item/new',
        waitOn: function() {
            return Meteor.subscribe('itemsCategories');
        },
        data: function() { return this.params._id; }
    });

    this.route('itemEdit', {
        path: '/project/:projectId/item/:_id/edit',
        waitOn: function() {
            return [
                Meteor.subscribe('singleItem', this.params._id)
            ];
        },
        data: function() { return Items.findOne(this.params._id); }
    });
});
