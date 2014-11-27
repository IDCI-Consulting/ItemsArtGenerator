Template.itemCreate.helpers({
    categories: function() {
        return ItemCategories.find({projectId: this.projectId});
    }
});

Template.itemCreate.events({
    'submit form': function(e, template) {
        e.preventDefault();

        var formData = $(e.target).serializeArray();
        var item = {
            categories: [],
        };

        var boundData = Meteor.bindFormData(item, formData);
        var itemId = Items.insert(boundData);

        if (boundData.categories.length === 0) {
            $("p.error").replaceWith('<p class="error">You must choose a category</p>');
        } else {
            _.each(boundData.categories, function(categoryId) {
                var category = ItemCategories.findOne(categoryId);
                Meteor.addCategoryItem(category, itemId);
                ItemCategories.update(category._id, {$set: {"items": category.items}});
            });
            $('#modalEditor').foundation('reveal', 'close');
        }
    }
});
