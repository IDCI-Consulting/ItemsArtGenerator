Items = new Meteor.Collection('items');

Meteor.methods({
    insertItem: function(itemAttributes) {
        var item = _.extend(_.pick(itemAttributes, 'name', 'description','options', 'categories', 'projectId'));

        Items.insert(item);
    }
});
