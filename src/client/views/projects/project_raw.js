Template.projectRaw.helpers({
    lines: function() {
        return ItemCategories.find({projectId: this._id});
    }
});
