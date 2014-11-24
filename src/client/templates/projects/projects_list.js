Template.projectsList.helpers({
    projects: function() {
        return Projects.find({state: "published", visibility: "public"});
    }
});

Template.projectsList.events({
    "click .createProject": function(e, template) {
        e.preventDefault();

        var instance = UI.render(Template.projectCreate);
        Meteor.loadModal(instance);
    },

    "click .createModel": function(e, template) {
        e.preventDefault();

        var instance = UI.render(Template.projectCreateModel);
        Meteor.loadModal(instance);
    }
});
