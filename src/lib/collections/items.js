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
            if (category.items !== undefined) {
                Meteor.removeCategoryItem(category, oldDocument._id);
                ItemCategories.update(category._id, {$set: {items: category.items}});
            }
        });
    }
});
