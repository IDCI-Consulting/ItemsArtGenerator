Template.projectsList.helpers({
    projects: function() {
        return Projects.find(
            {
                $or: [
                    {
                        state: "published",
                        visibility: "public"
                    },
                    {
                        authors: {
                            $in: [
                                Meteor.userId()
                            ]
                        }
                    }
                ]
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

        var instance = UI.render(Template.projectCreate);
        Meteor.loadModal(instance);
    },

    "click .createModel": function(e, template) {
        e.preventDefault();

        var instance = UI.render(Template.projectCreateModel);
        Meteor.loadModal(instance);
    }
});
