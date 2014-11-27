Template.itemEdit.helpers({
    allCategories: function() {
        return ItemCategories.find({projectId: this.projectId});
    },
    itemHasCategory: function(categories, categoryId) {
        return _.contains(categories, categoryId);
    }
});


Template.itemEdit.events({
    'submit form': function(e, template) {
        e.preventDefault();

        var formData = $(e.target).serializeArray(),
            item = {
                categories: [],
            };
        var boundData = Meteor.bindFormData(item, formData);

        if (boundData.categories.length === 0) {
            $("p.error").replaceWith('<p class="error">You must choose a category</p>');
        } else {
            Items.update(this._id, {$set: boundData});
            $('#modalEditor').foundation('reveal', 'close');
        }
    }
});
