Template.output.helpers({
    itemCategories: function() {
        return ItemCategories.find({projectId: this._id});
    }
});
