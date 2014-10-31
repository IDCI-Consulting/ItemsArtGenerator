Template.itemCategoryEdit.events({
    'submit form': function(e) {
        e.preventDefault();

        var formData = $(e.target).serializeArray(),
            itemCategory = {};

        var result = Meteor.bindFormData(itemCategory, formData);
        ItemCategories.update(this._id, {$set: result});
    }
});
