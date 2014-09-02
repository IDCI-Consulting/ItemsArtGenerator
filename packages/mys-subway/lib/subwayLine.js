/**
 * SubwayLine
 */
SubwayLine = function(object) {
    this._id = object._id;
    this.stations = [];
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
     */
    getId: function() {
        return this._id;
    },

    /**
     * Get name
     */
    getName: function() {
        return this.name;
    },

    /**
     * Set name
     * @param string
     */
    setName: function(name) {
        this.name = name;
    },

    /**
     * Get description
     */
    getDescription: function() {
        return this.description;
    },

    /**
     * Set description
     * @param string
     */
    setDescription: function(description) {
        this.description = description;
    },

    /**
     * Add station
     * @param station
     * 
     */
    addStation: function(station) {
        this.stations.push(station);
    },

    /**
     * Get stations
     */
    getStations: function() {
        return this.stations;
    },

    /**
     * Get color
     */
    getColor: function() {
        return this.options.color;
    },

    /**
     * Persist station
     * @param SubwayStation station
     */
    persist: function(line) {
        if (line._id === undefined) {
            ItemCategories.insert(line);
        } else {
            ItemCategories.update(line._id, {$set: line});
        }
    }
}
