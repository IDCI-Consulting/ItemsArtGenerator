/**
 * SubwayLine
 */
SubwayLine = function(object) {
    this._id = object._id;
    this.stations = {};
    this.name = object.name;
    this.description = object.description;
    this.options = object.options.subway;
}

SubwayLine.prototype = {
    /**
     * Constructor
     */
    constructor: SubwayLine,

    /**
     * Get id
     *
     * @return string
     */
    getId: function() {
        return this._id;
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
     * Set name
     *
     * @param string
     */
    setName: function(name) {
        this.name = name;
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
     * Set description
     *
     * @param string
     */
    setDescription: function(description) {
        this.description = description;
    },

    /**
     * Add station
     *
     * @param station
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

    /*
     * Get station
     *
     * @param number id
     * @return SubwayStation
     */
    getStation: function(id) {
        return this.stations[id];
    },

    /**
     * Get color
     *
     * @return string
     */
    getColor: function() {
        return this.options.color;
    },

    /**
     * Get subway
     *
     * @return Subway
     */
    getSubway: function() {
        return this.subway;
    },

    /**
     * Set subway
     *
     * @param Subway
     */
    setSubway: function(subway) {
        this.subway = subway;
    },

    /**
     * Has station
     *
     * @param number id
     * @return boolean
     */
    hasStation: function(id) {
        return this.getStation(id) !== undefined;
    },

    /**
     * Persist station
     */
    persist: function() {
        if (line._id === undefined) {
            ItemCategories.insert(line);
        } else {
            ItemCategories.update(line._id, {$set: line});
        }
    }
}
