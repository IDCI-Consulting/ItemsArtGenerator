Template.projectsList.helpers({
    projects: function() {
        return Projects.find({state: "published"});
    },
    isAdmin: function() {
        var admin = Users.findOne(Meteor.connection.userId());
        if (admin === undefined) {
            return false;
        }
        return admin.isAdmin;
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
