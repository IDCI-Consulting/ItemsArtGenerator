/*
 * Add an item's id in the category's array
 *
 * @param category: The category where we adding the item's id
 * @param itemId: The item's id
 */

Meteor.addCategoryItem = function(category, itemId) {
    var list = {};
    if(category.items === undefined || category.items === null) {
        category.items = {};
    }
    var position = _.size(category.items) + 1;
    list[position] = itemId;
    _.extend(category.items, list);
};


/*
 * Remove an item's id in the category's array
 *
 * @param category: The category where we adding the item's id
 * @param itemId: The item's id
 */

Meteor.removeCategoryItem = function(category, itemId) {
    var deletedKey;
    if (category) {
        _.each(category.items, function(value, key) {
            // delete the item
            if(itemId === value) {
                deletedKey = key;
                delete category.items[key];
            }
            // Recompute the position of items
            if(deletedKey != undefined && (parseInt(deletedKey) + 1) == key) {
                Meteor.recomputePosition(category.items);
            }
        });
    }
};


/*
 * Update an item's id in the category's array
 *
 * @param newItem: The new item's id which want to set
 * @param oldItem: The old item's id which want to delete
 */
Meteor.updateCategoryItem = function(newItem, oldItem) {
    var category = {};
    // Check if category is removed
    if(newItem.categories.length < oldItem.categories.length) {
        _.each(oldItem.categories, function(categoryIdFromOld, keyFromOld) {
            if(newItem.categories.length === 0 || newItem.categories.indexOf(categoryIdFromOld) === -1) {
                // Remove the item in collection if category is unchecked
                category = ItemCategories.findOne(categoryIdFromOld);
                if (category != undefined) {
                    Meteor.removeCategoryItem(category, newItem._id);
                    ItemCategories.update(category._id, {$set: {items: category.items}});
                }
            }
        });
    }

    // Check if category is added
    if(newItem.categories.length > oldItem.categories.length) {
        _.each(newItem.categories, function(categoryIdFromNew, keyFromNew) {
            if(oldItem.categories.length === 0 || oldItem.categories.indexOf(categoryIdFromNew) === -1) {
                // Add the item in category's collection if category's checkbox checked
                category = ItemCategories.findOne(categoryIdFromNew);
                if (category != undefined) {
                    Meteor.addCategoryItem(category, newItem._id);
                    ItemCategories.update(category._id, {$set: {items: category.items}});
                }
            }
        });
    }
};
