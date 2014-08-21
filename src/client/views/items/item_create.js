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

        var result = Meteor.bindFormData(item, formData);
        Meteor.call('insertItem', result, function(error) {
            if (error) {
                throwError(error.reason);
            } else {
                Router.go('projectShow', {_id: result.projectId});
            }
        });
    }
});
