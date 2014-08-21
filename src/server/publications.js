Meteor.publish('items', function() {
    return Items.find({});
});

Meteor.publish('itemCategories', function() {
    return ItemCategories.find({});
});

Meteor.publish('projects', function() {
    return Projects.find({});
});

Meteor.publish('singleProject', function(id) {
    return id && Projects.find(id);
});

Meteor.publish('singleItemCategory', function(id) {
    return id && ItemCategories.find(id);
});

Meteor.publish('singleItem', function(id) {
    return id && Items.find(id);
});
