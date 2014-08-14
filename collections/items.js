Items = new Meteor.Collection('items');

Meteor.methods({
    item: function(itemAttributes) {
        var item = _.extend(_.pick(itemAttributes, 'name', 'description','options', 'projectId', 'categories'), {
            createdAt: new Date().getTime()
        });

        Items.insert(item);
    }
});
