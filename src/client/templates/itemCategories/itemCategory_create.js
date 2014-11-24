Template.itemCategoryCreate.events({
    'submit form': function(e, template) {
        e.preventDefault();

        var formData = $(e.target).serializeArray(),
            itemCategory = {}
        ;

        var result = Meteor.bindFormData(itemCategory, formData);
        ItemCategories.insert(result);
        $('#modalEditor').foundation('reveal', 'close');
    }
});
