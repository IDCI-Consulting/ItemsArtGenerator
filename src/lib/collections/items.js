Items = new Mongo.Collection('items');

Meteor.methods({
    changeStationsRadius: function (projectId, radius) {

        Items.update({projectId: projectId}, {$set: {"options.subway.r": radius}}, {multi: true});
    }
});

Items.find({}).observe({
    changed: function(newDocument, oldDocument) {
        if (newDocument.categories && oldDocument.categories) {
            Meteor.updateCategoryItem(newDocument, oldDocument);
        }
    },
    removed: function(oldDocument) {
        // Remove the deleted item for each category
        if (oldDocument.categories.length !== 1) {
            _.each(oldDocument.categories, function(categoryId) {
                var category = ItemCategories.findOne(categoryId);
                Meteor.removeCategoryItem(category, oldDocument._id);
                ItemCategories.update(category._id, {$set: {items: category.items}});
            });
        }
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
