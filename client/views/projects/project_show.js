Template.projectShow.helpers({
    itemsCategories: function() {
        return ItemsCategories.find({projectId: this._id});
    }
});
