Items = new Meteor.Collection('items');

Meteor.methods({
    item: function(itemAttributes) {
        var item = _.extend(_.pick(itemAttributes, 'name', 'description', 'projectId', 'itemsCategories'), {
            createdAt: new Date().getTime()
        });

        Items.insert(item);
    }
});
