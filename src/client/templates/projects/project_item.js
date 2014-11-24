Template.projectItem.helpers({
    isAuthor: Meteor.isAuthor(Meteor.userId())
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

        var instance = UI.renderWithData(Template.projectEdit, Projects.findOne(this._id));
        Meteor.loadModal(instance);
    }
})
