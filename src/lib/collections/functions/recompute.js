Meteor.recomputePosition = function(items) {
    var position = 1;
    _.each(items, function(value, key) {
        items[position] = value;
        position++;
    });
    delete items[_.size(items)];
};
