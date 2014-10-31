Template.currentUserProjects.helpers({
    currentUserProjects: function() {
        return Projects.find({authors: {$in: [Meteor.connection.userId()]}});
    }
});

Template.currentUserProjects.events({
    'click .create-project': function(e, template) {
        e.preventDefault();

        var instance = UI.render(Template.projectCreate);
        Meteor.loadModal(instance);
    }
})
