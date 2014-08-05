Template.projectEdit.events({
    'submit form': function(e) {
        e.preventDefault();

        var currentProjectId = this._id;

        var projectProperties = {
            name: $(e.target).find('[name=name]').val(),
            description: $(e.target).find('[name=description]').val()
        }

        Projects.update(currentProjectId, {$set: projectProperties}, function() {
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
