Items = new Meteor.Collection('items');

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
