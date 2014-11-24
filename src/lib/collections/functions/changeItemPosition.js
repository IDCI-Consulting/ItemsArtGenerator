/*
 * Change the position of an item in the category's array
 *
 * @param category: The category where we modifying the item's position
 * @param initialPosition: The item's initial position
 * @param finalPosition: The item's final position
 *
 * @return false: If the item reached extremity of the category's array
 * @return true: When the position is changed
 */

Meteor.changeItemPosition = function(category, initialPosition, finalPosition) {
    if (finalPosition <= 0 || finalPosition > category.items.length) {
        return false;
    }
    var move = 1;
    var itemId = category.items[initialPosition];
    var items = {};
    if (initialPosition > finalPosition) {
        move = -1;
    }

    for (var i = initialPosition ;i !== finalPosition; i += move) {
        items[i] = category.items[i + move];
        if ((i + move) === finalPosition) {
            items[finalPosition] = itemId;
        }
    }

    _.each(items, function(value, key) {
        category.items[key] = value;
    });
    return true;
};
