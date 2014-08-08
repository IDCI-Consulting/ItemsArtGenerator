Template.projectCreate.events({
    'submit form': function(e) {
        e.preventDefault();

        var project = {},
            formData = $(e.target).serializeArray();

        Meteor.call('bindFormData', project, formData, function(error, result) {
            if (error) {
                throwError(error.reason);
            } else {
                Meteor.call('project', result, function(error, id) {
                    if (error) {
                        throwError(error.reason);
                    } else {
                        Router.go('projectShow', {_id: id});
                    }
                });
            }
        });
    }
});
