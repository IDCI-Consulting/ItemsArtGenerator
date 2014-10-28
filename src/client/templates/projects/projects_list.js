Template.projectsList.helpers({
    projects: function() {
        return Projects.find({state: "published"});
    },
    isAdmin: function() {
        return true;
    }
});

Template.projectsList.events({
    "click .createProject": function(e) {
        e.preventDefault();

        var instance = UI.render(Template.projectCreate);
        Meteor.loadModal(instance);
    },

    "click .createModel": function(e) {
        e.preventDefault();

        var instance = UI.render(Template.projectCreateModel);
        Meteor.loadModal(instance);
    }
});
