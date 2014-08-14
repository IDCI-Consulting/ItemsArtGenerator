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
    }
})
