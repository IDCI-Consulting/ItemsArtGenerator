Template.subwayLineStations.helpers({
    stations: function() {
        var items = Items.find({categories: {$in: [this._id]}}).fetch();
        var stations = [];
        _.each(items, function(item, index) {
            stations.push({
                'index': index,
                'raw': item
            });
        });

        return stations;
    }
});

Template.subwayLineStations.rendered = function() {
    $(".subway-map").subwayMap({ debug: true });
};
