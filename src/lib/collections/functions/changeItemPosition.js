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
