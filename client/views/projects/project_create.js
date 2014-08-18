Template.projectCreate.events({
    'submit form': function(e) {
        e.preventDefault();

        var project = {},
            formData = $(e.target).serializeArray();

        var result = Meteor.bindFormData(project, formData);
        Meteor.call('project', result, function(error, id) {
            if (error)
                throwError(error.reason);
        });
    }
});
