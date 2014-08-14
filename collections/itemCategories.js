ItemCategories = new Meteor.Collection('itemCategories');

Meteor.methods({
    itemCategory: function(itemCategoryAttributes) {
        var itemCategory = _.extend(_.pick(itemCategoryAttributes, 'name', 'description', 'options', 'projectId'), {
            createdAt: new Date().getTime()
        });

        ItemCategories.insert(itemCategory);
    }
});
