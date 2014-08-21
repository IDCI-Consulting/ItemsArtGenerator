Template.projectsList.helpers({
    projects: function() {
        return Projects.find();
    }
});

Template.projectsList.events({
    "click .createProject": function(e) {
        e.preventDefault();

        var instance = UI.render(Template.projectCreate);
        Meteor.loadModal(instance);
    }
});
