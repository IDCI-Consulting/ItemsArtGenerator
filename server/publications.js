Meteor.publish('items', function() {
    return Items.find({});
});

Meteor.publish('itemsCategories', function() {
    return ItemsCategories.find({});
});

Meteor.publish('projects', function() {
    return Projects.find({});
});

Meteor.publish('singleProject', function(id) {
    return id && Projects.find(id);
});

Meteor.publish('singleItemCategory', function(id) {
    return id && ItemsCategories.find(id);
});

Meteor.publish('singleItem', function(id) {
    return id && Items.find(id);
});
