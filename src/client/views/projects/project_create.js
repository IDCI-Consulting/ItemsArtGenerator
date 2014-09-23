Template.projectCreate.events({
    'submit form': function(e) {
        e.preventDefault();

        var project = {},
            formData = $(e.target).serializeArray();

        var boundData = Meteor.bindFormData(project, formData);
        Project.insert(boundData);
    }
});
