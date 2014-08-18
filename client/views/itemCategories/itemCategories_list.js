Template.itemCategoriesList.helpers({
    itemCategories: function() {
        return ItemCategories.find();
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

    "click .editItemCategory": function(e) {
        e.preventDefault();

        var instance = UI.renderWithData(Template.itemCategoryEdit, ItemCategories.findOne(this._id));
        Meteor.loadModal(instance);
    }
})
