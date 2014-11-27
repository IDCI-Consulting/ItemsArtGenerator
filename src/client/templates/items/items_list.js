Template.itemsList.helpers({
    lines: function() {
        return ItemCategories.find({projectId: this._id});
    },
    selected: function(categoryId) {
        this.categories = [];
        this.categories.push(categoryId);
        return Session.equals("selected_item_id", this._id) && Session.equals("selected_itemCategory_id", categoryId) ? "selected" : '';
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
    },

    'click .item': function () {
        Session.set("selected_item_id", this._id);
        Session.set("selected_itemCategory_id", this.categories[0]);
    }
})
