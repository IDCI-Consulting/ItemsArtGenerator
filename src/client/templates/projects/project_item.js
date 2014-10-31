Template.projectItem.helpers({
    isAuthor: function() {
        var bool;
        console.log(UserId);
        _.each(this.authors, function(authorId) {
            if(authorId === UserId) {
                bool = true;
            } else {
                bool = false;
            }
        });
        return bool;
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

        var instance = UI.renderWithData(Template.projectEdit, Projects.findOne(this._id));
        Meteor.loadModal(instance);
    }
})
