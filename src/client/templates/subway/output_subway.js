Template.outputSubway.helpers({
    lines: function() {
        return ItemCategories.find({projectId: this._id});
    },
    url: function() {
        return Images.findOne(this.background).url();
    }
});
