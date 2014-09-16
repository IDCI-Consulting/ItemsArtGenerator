Template.itemsList.helpers({
    items: function() {
        return Items.find({projectId: this._id});
    }
});

Template.itemsList.events({
    "click .delete" : function(e) {
        e.preventDefault();

        if(confirm("Delete this item ?")) {
            var currentItemId = this._id;
            Items.remove(currentItemId);
        }
    },

    "click .edit-item": function(e) {
        e.preventDefault();

        var instance = UI.renderWithData(Template.itemEdit, Items.findOne(this._id));
        Meteor.loadModal(instance);
    }
})
