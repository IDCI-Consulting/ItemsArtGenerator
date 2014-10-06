Template.projectCreate.events({
    'submit form': function(e) {
        e.preventDefault();

        var formData = $(e.target).serializeArray();
        var project = {
            createdAt: new Date().getTime(),
        };

        var boundData = Meteor.bindFormData(project, formData);
        Projects.insert(boundData);
    }
});
