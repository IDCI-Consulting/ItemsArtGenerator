Template.itemCreate.helpers({
    categories: function() {
        return ItemCategories.find().fetch();
    }
});

Template.itemCreate.events({
    'submit form': function(e, template) {
        e.preventDefault();

        var formData = $(e.target).serializeArray(),
            item = {
                categories: [],
            };

        var boundData = Meteor.bindFormData(item, formData);
        var itemId = Items.insert(boundData);

        _.each(boundData.categories, function(categoryId) {
            var category = ItemCategories.findOne(categoryId);
            Meteor.addCategoryItem(category, itemId);
            ItemCategories.update(category._id, {$set: {"items": category.items}});
        });
    }
});
