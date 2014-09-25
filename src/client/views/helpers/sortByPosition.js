UI.registerHelper('sortByPosition', function(categoryItems, projectId) {
    var itemsSorted = [];
    var items = Items.find({projectId: projectId}).fetch();

    // Sort items
    _.each(categoryItems, function(itemId) {
        _.each(items, function(item) {
            if(itemId === item._id) {
                itemsSorted.push(item);
            }
        });
    });

    return itemsSorted;
});
