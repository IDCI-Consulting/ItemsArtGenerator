ItemCategories = new Meteor.Collection('itemCategories');

Meteor.methods({
    insertItemCategory: function(itemCategoryAttributes) {
        var itemCategory = _.extend(_.pick(itemCategoryAttributes, 'name', 'description', 'options', 'projectId'), {
            createdAt: new Date().getTime()
        });

        ItemCategories.insert(itemCategory);
    }
});
