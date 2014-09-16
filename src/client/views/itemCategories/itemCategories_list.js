Template.itemCategoriesList.helpers({
    itemCategories: function() {
        return ItemCategories.find({projectId: this._id});
    }
});

Template.itemCategoriesList.events({
    "click .delete": function(e) {
        e.preventDefault();

        if(confirm("Delete this itemCategory ?")) {
            var currentItemCategoryId = this._id;
            ItemCategories.remove(currentItemCategoryId);
        }
    },

    "click .edit-item-category": function(e) {
        e.preventDefault();

        var instance = UI.renderWithData(Template.itemCategoryEdit, ItemCategories.findOne(this._id));
        Meteor.loadModal(instance);
    }
})
