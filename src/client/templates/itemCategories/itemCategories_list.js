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

        var instance = Blaze.renderWithData(Template.itemCategoryEdit, ItemCategories.findOne(this._id), $('#modalEditor > .content').get(0));
        Meteor.loadModal(instance);
    }
})
