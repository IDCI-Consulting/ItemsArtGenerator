/**
 * SubwayStation
 */
SubwayStation = function(object) {
    this._id = object._id;
    this.name = object.name;
    this.description = object.description;
    this.lines = [];
    this.options = object.options.subway;
}

SubwayStation.prototype = {
    /**
     * Constructor
     */
    constructor: SubwayStation,

    /**
     * Get id
     */
    getId: function() {
        return this.id;
    },

    /**
     * Get name
     */
    getName: function() {
        return this.name;
    },

    /**
     * Set name
     * @param string name
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
     * @param string description
     */
    setDescription: function(description) {
        this.description = description;
    },

    /**
     * Add line
     * @param SubwayLine line
     * 
     */
    addSubwayLine: function(line) {
        this.lines.push(line);
    },

    /**
     * Get lines
     */
    getSubwayLines: function() {
        return this.lines;
    },

    /**
     * Get x
     */
    getX: function() {
        return this.options.cx;
    },

    /**
     * Set x
     * @param integer x
     */
    setX: function(x) {
        this.options.cx = x;
    },

    /**
     * Get y
     */
    getY: function() {
        return this.options.cy;
    },

    /**
     * Set y
     * @param integer y
     */
    setY: function(y) {
        this.options.cy = y;
    },

    getNodeRadius: function() {
        return 10 + (this.lines.length - 1) * 3;
    },

    /**
     * Set being changed on
     */
    setBeingChangedOn: function() {
        this.options.dragged = true;
    },

    /**
     * Set being changed off
     */
    setBeingChangedOff: function() {
        this.options.dragged = false;
    },

    /**
     * Moved station
     * @param integer x
     * @param integer y
     */
    movedStation: function(x, y) {
        this.options.cx = x;
        this.options.cy = y;
    },

    /**
     * Persist station
     * @param SubwayStation station
     */
    persist: function(station) {
        if (station._id === undefined) {
            Items.insert({
                "name": this.name,
                "description": this.description,
            });
        } else {
            Items.update(station._id, {$set: station});
        }
    }
}
