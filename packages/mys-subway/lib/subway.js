/**
 * Subway
 */
Subway = function(object) {
    this._id = object._id;
    this.name = object.name;
    this.description = object.description;
    this.lines = {};
    this.stations = {};
}

Subway.prototype = {
    /**
     * Constructor
     */
    constructor: Subway,

    /**
     * Get id
     *
     * @return string
     */
    getId: function() {
        return this._id;
    },

    /**
     * Set name
     *
     * @param string
     */
    setName: function(name) {
        this.name = name;
    },

    /**
     * Get name
     *
     * @return string
     */
    getName: function() {
        return this.name;
    },

    /**
     * Set description
     *
     * @param string
     */
    setDescription: function(description) {
        this.description = description;
    },

    /**
     * Get description
     *
     * @return string
     */
    getDescription: function() {
        return this.description;
    },

    /**
     * Add line
     *
     * @param line
     * 
     */
    addLine: function(line) {
        this.lines[line.getId()] = line;
    },

    /**
     * Get lines
     *
     * @return object
     */
    getLines: function() {
        return this.lines;
    },

    /**
     * Get line
     *
     * @param id The SubwayLine id
     * @return SubwayLine
     */
    getLine: function(id) {
        return this.lines[id];
    },

    /**
     * Add station
     *
     * @param SubwayStation station
     */
    addStation: function(station) {
        this.stations[station.getId()] = station;
    },

    /**
     * Get stations
     *
     * @return object
     */
    getStations: function() {
        return this.stations;
    },

    /**
     * Get station
     *
     * @param id The SubwayStation id
     * @return SubwayStation
     */
    getStation: function(id) {
        return this.stations[id];
    },
}
