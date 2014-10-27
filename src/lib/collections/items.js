Items = new Meteor.Collection('items');

Items.find({}).observe({
    changed: function(newDocument, oldDocument) {
        if (newDocument.categories !== undefined && oldDocument.categories !== undefined) {
            Meteor.updateCategoryItem(newDocument, oldDocument);
        }
    },
    removed: function(oldDocument) {
        // Remove the deleted item for each category
        _.each(oldDocument.categories, function(categoryId) {
            var category = ItemCategories.findOne(categoryId);
            Meteor.removeCategoryItem(category, oldDocument._id);
            ItemCategories.update(category._id, {$set: {items: category.items}});
        });
    }
});

Items.allow({
    insert: function(userId, doc) {
        var project = Projects.findOne(doc.projectId);
        return _.contains(project.authors, userId);
    },
    update: function (userId, doc, fields, modifier) {
        var project = Projects.findOne(doc.projectId);
        return _.contains(project.authors, userId);
    },
    remove: function (userId, doc) {
        var project = Projects.findOne(doc.projectId);
        return _.contains(project.authors, userId);
    }
});
