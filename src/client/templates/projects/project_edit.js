Template.projectEdit.events({
    'submit form': function(e) {
        e.preventDefault();

        var formData = $(e.target).serializeArray();
        var project = {
                updatedAt: new Date().getTime(),
            };

        var boundData = Meteor.bindFormData(project, formData);
        Projects.update(this._id, {$set: boundData});
        $('#modalEditor').foundation('reveal', 'close');
    },

    'click .delete': function(e) {
        e.preventDefault();

        if (confirm("Delete this project ?")) {
            var currentProjectId = this._id;
            Projects.remove(currentProjectId);
            Router.go('projects');
        }
    }
});
