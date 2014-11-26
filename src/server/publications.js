// ITEMS PUBLICATION
Meteor.publish('items', function() {
    return Items.find({});
});

Meteor.publish('singleItem', function(id) {
    return id && Items.find(id);
});

// PROJECTS PUBLICATION
Meteor.publish('projects', function() {
    return Projects.find({});
});

Meteor.publish('singleProject', function(id) {
    return id && Projects.find(id);
});

// ITEMCATEGORIES PUBLICATION
Meteor.publish('itemCategories', function() {
    return ItemCategories.find({});
});

Meteor.publish('singleItemCategory', function(id) {
    return id && ItemCategories.find(id);
});

Meteor.publish('images', function () {
    return Images.find({});
});
