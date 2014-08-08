Template.projectEdit.events({
    'submit form': function(e) {
        e.preventDefault();

        var currentProjectId = this._id,
            formData = $(e.target).serializeArray(),
            projectProperties = {};

        Meteor.call('bindFormData', projectProperties, formData, function(error, result) {
            if (error) {
                throwError(error.reason);
            } else {
                Projects.update(currentProjectId, {$set: result}, function() {
                    Router.go('projectShow', {_id: currentProjectId});
                });
            }
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
