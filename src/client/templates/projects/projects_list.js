Template.projectsList.helpers({
    projects: function() {
        if(Meteor.checkIfUserIsAdmin(Meteor.userId())) {
            return Projects.find({$or: [{state: "new",visibility: "public"}, {state: "published",visibility: "public"},{authors: {$in: [Meteor.userId()]}}]},{sort: { createdAt : -1 }});
        }
        return Projects.find(
            {
              authors: {
                $in: [
                    Meteor.userId()
                ]
              }
            },
            {
                sort: { createdAt : -1 }
            }
        );
    },
    isAdmin: function() {
        var user = Meteor.users.findOne(Meteor.userId());
        return user.profile.isAdmin;
    }
});

Template.projectsList.events({
    "click .createProject": function(e, template) {
        e.preventDefault();

        var instance = Blaze.render(Template.projectCreate, $('#modalEditor > .content').get(0));
        Meteor.loadModal(instance);
    },

    "click .createModel": function(e, template) {
        e.preventDefault();

        var instance = Blaze.render(Template.projectCreateModel, $('#modalEditor > .content').get(0));
        Meteor.loadModal(instance);
    }
});
