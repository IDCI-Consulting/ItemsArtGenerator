Template.itemCategoryCreate.events({
    'submit form': function(e, template) {
        e.preventDefault();

        formData = $(e.target).serializeArray();

        var itemCategory = {
            projectId: template.data._id
        };

        Meteor.call('bindFormData', itemCategory, formData, function(error, result) {
            if (error) {
                throwError(error.reason);
            } else {
                Meteor.call('itemCategory', result, function(error) {
                    if (error) {
                        throwError(error.reason);
                    } else {
                        Router.go('projectShow', {_id: template.data._id});
                    }
                });
            }
        });
    },

});
