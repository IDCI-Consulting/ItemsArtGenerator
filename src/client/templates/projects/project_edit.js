Template.projectEdit.helpers({
    isAdmin: function() {
        var user = Meteor.users.findOne(Meteor.userId());
        return user.profile.isAdmin;
    }
});

Template.projectEdit.events({
    'submit form': function(e) {
        e.preventDefault();

        var formData = $(e.target).serializeArray();
        var project = {
                updatedAt: new Date().getTime()
            };

        var boundData = Meteor.bindFormData(project, formData);
        if (boundData.tags) {
            var string = boundData.tags.replace(/\ */g,'');
            boundData.tags = [];
            var tags = string.split(',');
            boundData.tags = tags;
        }

        Projects.update(this._id, {$set: boundData});
        $('#modalEditor').foundation('reveal', 'close');
    },

    'click .delete': function(e) {
        e.preventDefault();

        if (confirm("Delete this project ?")) {
            var currentProjectId = this._id;
            Projects.remove(currentProjectId);
            Router.go('projects');
        }
    }
});
