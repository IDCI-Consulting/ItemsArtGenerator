UI.registerHelper('sortByPosition', function(category) {
    var itemsSorted = [];
    var items = Items.find({categories: {$in: [category._id]}}).fetch();

    // Sort items
    _.each(category.items, function(itemId) {
        _.each(items, function(item) {
            if(itemId === item._id) {
                itemsSorted.push(item);
            }
        });
    });

    return itemsSorted;
});
