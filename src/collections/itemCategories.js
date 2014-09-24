ItemCategories = new Meteor.Collection('itemCategories');

ItemCategories.find({}).observe({
    changed: function(newDocument, oldDocument) {
    },
    removed: function(oldDocument) {
        var items = Items.find({categories: {$in: [oldDocument._id]}}).fetch();
        _.each(items, function(item) {
            var index = item.categories.indexOf(oldDocument._id);
            if (index > -1) {
                item.categories.splice(index, 1);
            }
            Items.update(item._id, {$set: {categories: item.categories}});
        });
    }
});
