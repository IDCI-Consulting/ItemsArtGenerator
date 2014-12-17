Template.itemsList.helpers({
    lines: function() {
        return ItemCategories.find({projectId: this._id});
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

        var instance = Blaze.renderWithData(Template.itemEdit, Items.findOne(this._id), $('#modalEditor > .content').get(0));
        Meteor.loadModal(instance);
    }
})
