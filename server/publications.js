Meteor.publish('items', function() {
    return Items.find({});
});

Meteor.publish('itemsCategories', function() {
    return ItemsCategories.find({});
});

Meteor.publish('projects', function() {
    return Meteor.find({});
});
