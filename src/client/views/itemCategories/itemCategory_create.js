Template.itemCategoryCreate.events({
    'submit form': function(e, template) {
        e.preventDefault();

        var formData = $(e.target).serializeArray(),
            itemCategory = {};

        var result = Meteor.bindFormData(itemCategory, formData);
        Meteor.call('insertItemCategory', result, function(error) {
            if (error) {
                throwError(error.reason);
            } else {
                Router.go('projectShow', {_id: result.projectId});
            }
        });
    },

});
