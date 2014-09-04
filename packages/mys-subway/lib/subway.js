/**
 * Subway
 */
Subway = function(object) {
    this._id = object._id;
    this.name = object.name;
    this.description = object.description;
    this.lines = [];
}

Subway.prototype = {
    /**
     * Constructor
     */
    constructor: Subway,

    /**
     * Get id
     */
    getId: function() {
        return this.id;
    },

    /**
     * Set name
     * @param string
     */
    setName: function(name) {
        this.name = name;
    },

    /**
     * Get name
     */
    getName: function() {
        return this.name;
    },

    /**
     * Set description
     * @param string
     */
    setDescription: function(description) {
        this.description = description;
    },

    /**
     * Get description
     */
    getDescription: function() {
        return this.description;
    },

    /**
     * Add subwayLine
     * @param line
     * 
     */
    addSubwayLine: function(line) {
        this.lines.push(line);
    },

    /**
     * Get subwayLines
     */
    getSubwayLines: function() {
        return this.lines;
    },

}
