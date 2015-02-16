Items = new Mongo.Collection('items');

Meteor.methods({
    changeStationsRadius: function (projectId, radius) {

        Items.update({projectId: projectId}, {$set: {"options.subway.r": radius}}, {multi: true});
    },
    removeItem: function (item) {
        // Delete item from Category
        var category = ItemCategories.findOne(item.categories[0]);
        Meteor.removeCategoryItem(category, item._id);
        ItemCategories.update(category._id, {$set: {items: category.items}});
        var mongoItem = Items.findOne(item._id);

        // Delete category from item
        var index = mongoItem.categories.indexOf(category._id);
        mongoItem.categories.splice(index, 1);
        Items.update(mongoItem._id, {$set: {categories: mongoItem.categories}});

        // Delete item in mongo if there is no category for this item
        if (mongoItem.categories.length === 0) {
            Items.remove(mongoItem._id);

        }
    }
});

Items.find({}).observe({
    changed: function(newDocument, oldDocument) {
        if (newDocument.categories && oldDocument.categories) {
            if(newDocument.categories.length !== oldDocument.categories.length) {
                Meteor.updateCategoryItem(newDocument, oldDocument);
            }
        }
        var project = Projects.findOne(newDocument.projectId);
        if (project.state === "published") {
          Meteor.unpublishedActions(project._id);
        }
    },
    removed: function(oldDocument) {
        // Remove the deleted item for each category
        if (oldDocument.categories.length !== 0) {
            _.each(oldDocument.categories, function(categoryId) {
                var category = ItemCategories.findOne(categoryId);
                if (category) {
                    Meteor.removeCategoryItem(category, oldDocument._id);
                    ItemCategories.update(category._id, {$set: {items: category.items}});
                }
            });
        }
    }
});

Items.allow({
    insert: function(userId, doc) {
        if (Meteor.checkIfUserIsAdmin(userId)) {
            return true;
        }
        var project = Projects.findOne(doc.projectId);
        return _.contains(project.authors, userId);
    },
    update: function (userId, doc, fields, modifier) {
        if (Meteor.checkIfUserIsAdmin(userId)) {
            return true;
        }
        var project = Projects.findOne(doc.projectId);
        return _.contains(project.authors, userId);
    },
    remove: function (userId, doc) {
        if (Meteor.checkIfUserIsAdmin(userId)) {
            return true;
        }
        var project = Projects.findOne(doc.projectId);
        return _.contains(project.authors, userId);
    }
});
