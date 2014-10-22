Template.projectItem.events({
    'click .delete': function(e, template) {
        e.preventDefault();

        if(confirm("Delete this project ?")) {
            Projects.remove(this._id);
            Router.go('projects');
        }
    },

    "click .editProject": function(e) {
        e.preventDefault();

        var instance = UI.renderWithData(Template.projectEdit, Projects.findOne(this._id));
        Meteor.loadModal(instance);
    }
})
