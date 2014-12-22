Template.projectItem.helpers({
    isAuthor: function() {
        if (Meteor.checkIfUserIdAdmin(Meteor.userId())) {
            return true;
        }
        return _.contains(this.authors, Meteor.userId());
    }
});

Template.projectItem.events({
    'click .delete': function(e, template) {
        e.preventDefault();

        if(confirm("Delete this project ?")) {
            Projects.remove(this._id);
            Router.current();
        }
    },

    "click .editProject": function(e) {
        e.preventDefault();

        var instance = Blaze.renderWithData(Template.projectEdit, Projects.findOne(this._id), $('#modalEditor > .content').get(0));
        Meteor.loadModal(instance);
    },

    "click .editModel": function(e) {
        e.preventDefault();

        var instance = Blaze.renderWithData(Template.projectEditModel, Projects.findOne(this._id), $('#modalEditor > .content').get(0));
        Meteor.loadModal(instance);
    }
})
