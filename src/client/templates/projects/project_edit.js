Template.projectEdit.helpers({
    isAdmin: function() {
        var user = Meteor.users.findOne(Meteor.userId());
        return user.profile.isAdmin;
    },
    isNotBlocked: function() {
        var user = Meteor.users.findOne(Meteor.userId());
        if (this.state === 'blocked' && !user.profile.isAdmin) {
              return false;
        }

        return true;
    }
});

Template.projectEdit.rendered = function() {
    if (!Modernizr.inputtypes.date) {
        $('input[type=date]').datepicker({
            dateFormat: 'dd-mm-yy'
        });
    }

    Meteor.setSelectedValue($('select[name="visibility"]'), this.data.visibility);
    Meteor.setSelectedValue($('select[name="state"]'), this.data.state);
};

Template.projectEdit.events({
    'submit form': function(e) {
        e.preventDefault();

        var formData = $(e.target).serializeArray();
        var project = {
                updatedAt: new Date().getTime()
            };

        var boundData = Meteor.bindFormData(project, formData);

        if (boundData.tags) {
            boundData.tags = Meteor.createTagsArray(boundData.tags);
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
