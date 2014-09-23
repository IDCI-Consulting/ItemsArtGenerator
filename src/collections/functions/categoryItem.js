Meteor.addCategoryItem = function(category, itemId) {
    var list = {};
    if(category.items === undefined) {
        category.items = {};
    }
    var position = _.size(category.items) + 1;
    list[position] = itemId;
    _.extend(category.items, list);
};

Meteor.removeCategoryItem = function(category, itemId) {
    _.each(category.items, function(value, key) {
        if(itemId === value) {
            delete category.items[key];
        }
    });
};
