Template.subwayLine.helpers({
    line: function() {
        var subwayLine = new SubwayLine(this);

        var items = Items.find({categories: {$in: [this._id]}}).fetch();
        _.each(items, function(item, index) {
            var station = new SubwayStation(item.subway);
            subwayLine.addStation(station);
        });

        return subwayLine;
    }
});
