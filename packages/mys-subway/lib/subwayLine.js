/**
 * SubwayLine
 */
SubwayLine = function(document) {
    this.document = document;
    this.stations = [];
    this.name = document.name;
    this.description = document.description;
    this.color = this.getOption('color', '#00FF00');
}

SubwayLine.prototype = {
    /**
     * Constructor
     */
    constructor: SubwayLine,

    /**
     * Add station
     * @param station
     * 
     */
    addStation: function(station) {
        this.stations.push(station);
    }
}
