Template.projectItem.events({
    'click .delete': function(e, template) {
        e.preventDefault();

        var currentProjectId = template.data.projectId;

        if(confirm("Delete this project ?")) {
            var currentItemId = this._id;
            Projects.remove(currentItemId);
            Router.go('projects');
        }
    }
})
