/**
 * SubwayStation
 */
SubwayStation = function(object) {
    this.name = object.name;
    this.description = object.description;
    this.options = object.options;
}

SubwayStation.prototype = {
    /**
     * Constructor
     */
    constructor: SubwayStation,

    /**
     * Insert new station's coords
     * @param SubwayStation
    */
    insertNewStationCoords: function(station) {
        console.log(station.options.subway.cx);
        console.log(station.options.subway.cy);
        console.log(station.options.subway.selected);
        Items.update({_id: station._id}, {$set: {options: {subway: station.options.subway}}});
    },

    /**
     * Set current selected station
     * @param SubwayStation
     */
    setCurrentSelected: function(station) {
        console.log(station.options.subway.cx);
        console.log(station.options.subway.cy);
        console.log(station.options.subway.selected);
        //Items.update({_id: station._id}, {$set: {options: {subway: station.options.subway}}});
    },

    /**
     * Move station
     * @param DOM
    */
    moveStation: function(document) {
        var moved = d3.select(document);
        moved
            .attr("transform", function(station) {
                station.options.subway.cx = d3.event.x;
                station.options.subway.cy = d3.event.y;
                return "translate("+ [station.options.subway.cx,station.options.subway.cy] + ")";
            })
        ;
    }
}
