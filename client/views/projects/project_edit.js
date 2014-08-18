Template.projectEdit.events({
    'submit form': function(e) {
        e.preventDefault();

        var currentProjectId = this._id,
            formData = $(e.target).serializeArray(),
            project = {};

        var result = Meteor.bindFormData(project, formData);
        Projects.update(currentProjectId, {$set: result}, function() {
            Router.go('projectShow', {_id: currentProjectId});
        });
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
