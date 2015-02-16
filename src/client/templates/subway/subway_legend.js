Template.subwayLegend.helpers({
    lines: function() {
        return ItemCategories.find({projectId: this._id}, {sort: { name: 1 }});
    }
});
