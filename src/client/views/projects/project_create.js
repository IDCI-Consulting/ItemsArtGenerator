Template.projectCreate.events({
    'submit form': function(e) {
        e.preventDefault();

        var formData = $(e.target).serializeArray();
        console.log(formData);
        var project = {
            createdAt: new Date().getTime(),
        };

        var boundData = Meteor.bindFormData(project, formData);
        Projects.insert(boundData);
    }
});
