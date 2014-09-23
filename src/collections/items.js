Items = new Meteor.Collection('items');

Items.find({}).observe({
    changed: function(newDocument, oldDocument) {
        if(!newDocument.options.subway['dragged']) {
            console.log(newDocument);
        }
    },
    removed: function(oldDocument) {
        _.each(oldDocument.categories, function(categoryId) {
            var category = ItemCategories.findOne(categoryId);
            Meteor.removeCategoryItem(category, oldDocument._id);
            ItemCategories.update(category._id, {$set: {items: category.items}});
        });
    }
});
