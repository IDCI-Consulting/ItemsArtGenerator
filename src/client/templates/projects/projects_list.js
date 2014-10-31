Template.projectsList.helpers({
    projects: function() {
        return Projects.find({visibility: "public", state:"published"});
    },
    isAdmin: function() {
        return this.isAdmin;
    }
});

Template.projectsList.events({
    "click .createProject": function(e, template) {
        e.preventDefault();

        var instance = UI.renderWithData(Template.projectCreate, {'userId': template.data._id});
        Meteor.loadModal(instance);
    },

    "click .createModel": function(e) {
        e.preventDefault();

        var instance = UI.renderWithData(Template.projectCreate, {'userId': template.data._id});
        Meteor.loadModal(instance);
    }
});
