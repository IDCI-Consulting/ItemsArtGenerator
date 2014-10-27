Template.projectsList.helpers({
    projects: function() {
        return Projects.find({state: "published"});
    }
});

Template.projectsList.events({
    "click .createProject": function(e) {
        e.preventDefault();

        var instance = UI.render(Template.projectCreate);
        Meteor.loadModal(instance);
    },

    "click .createUser": function(e) {
        e.preventDefault();

        var instance = UI.render(Template.userCreate);
        Meteor.loadModal(instance);
    }
});