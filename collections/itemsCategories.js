ItemsCategories = new Meteor.Collection('itemsCategories');

Meteor.methods({
    itemCategory: function(itemCategoryAttributes) {
        var itemCategory = _.extend(_.pick(itemCategoryAttributes, 'name', 'description', 'projectId'), {
            createdAt: new Date().getTime()
        });

        ItemsCategories.insert(itemCategory);
    }
});
