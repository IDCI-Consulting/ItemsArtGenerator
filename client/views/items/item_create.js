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
                categories: []
            };

        Meteor.call('bindFormData', item, formData, function(error, result) {
            if (error) {
                throwError(error.reason);
            } else {
                Meteor.call('item', result, function(error) {
                    if (error) {
                        throwError(error.reason);
                    } else {
                        Router.go('projectShow', {_id: template.data});
                    }
                });
            }
        });
    }
});
