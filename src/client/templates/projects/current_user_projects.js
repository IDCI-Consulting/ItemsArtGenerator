Template.currentUserProjects.helpers({
    currentUserProjects: function() {
        Meteor.subscribe('currentUserProjects', UserId);
        var projects = Projects.find({authors: {$in: [UserId]}}).fetch();
        console.log(projects);
        return projects;
    }
});

Template.currentUserProjects.events({
    'click .create-project': function(e, template) {
        e.preventDefault();

        var instance = UI.render(Template.projectCreate);
        Meteor.loadModal(instance);
    }
})
