Template.currentUserProjects.helpers({
    currentUserProjects: function() {
        Meteor.subscribe('currentUserProjects', UserId);
        return Projects.find({authors: {$in: [UserId]}}).fetch();
    },
    userId: UserId
});

Template.currentUserProjects.events({
    'click .create-project': function(e, template) {
        e.preventDefault();

        var instance = UI.render(Template.projectCreate);
        Meteor.loadModal(instance);
    }
})
