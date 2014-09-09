Template.outputSubway.helpers({
    subway: function() {
        var subway = new Subway(this);
        var lines = ItemCategories.find({projectId: subway.getId()}).fetch();
        var stations = Items.find({projectId: subway.getId()}).fetch();

        _.each(lines, function(lineValue, lineKey) {
            var subwayLine = new SubwayLine(lineValue);
            subwayLine.setSubway(subway);
            subway.addLine(subwayLine);
        });

        _.each(stations, function(stationValue, stationKey) {
            var subwayStation = new SubwayStation(stationValue);
            subwayStation.setSubway(subway);
            _.each(stationValue.categories, function(lineId) {
                subwayStation.addLine(subway.getLine(lineId));
            });
            subway.addStation(subwayStation);
        });

        var s = subway.getStations();

        return subway;
    }
});

UI.registerHelper('list', function(context, options) {
    var ret = [];

    _.each(context, function(value, key) {
        ret.push(value);
    });

    return ret;
});


