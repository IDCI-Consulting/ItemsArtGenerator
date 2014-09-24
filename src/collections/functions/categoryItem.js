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
    var deletedKey;
    _.each(category.items, function(value, key) {
        if(itemId === value) {
            deletedKey = key;
            delete category.items[key];
        }
        if(deletedKey != undefined && (parseInt(deletedKey) + 1) == key) {
            category.items[deletedKey] = category.items[key];
            delete category.items[key];
            deletedKey = parseInt(deletedKey) + 1;
            console.log(category.items);
        }

    });
};
