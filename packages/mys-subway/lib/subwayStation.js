/**
 * SubwayStation
 */
SubwayStation = function(object) {
    this._id = object._id;
    this.name = object.name;
    this.description = object.description;
    this.lines = {};
    this.options = object.options.subway;
}

SubwayStation.prototype = {
    /**
     * Constructor
     */
    constructor: SubwayStation,

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
     * @param string name
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
     * @param string description
     */
    setDescription: function(description) {
        this.description = description;
    },

    /**
     * Add line
     *
     * @param SubwayLine line
     */
    addLine: function(line) {
        if(!line.hasStation(this.getId())) {
            line.addStation(this);
        }
        this.lines[line.getId()] = line;
    },

    /**
     * Get lines
     *
     * @return array
     */
    getLines: function() {
        return this.lines;
    },

    /*
     * Get line
     *
     * @param string id
     * @return SubwayLine
     */
    getLine: function(id) {
        return this.lines[id];
    },

    /**
     * Get options
     *
     * @return object
     */
    getOptions: function() {
        return this.options;
    },

    /**
     * Set options
     *
     * @param object options
     */
    setOptions: function(options) {
        this.options = options;
    },

    /**
     * Get x
     *
     * @return number
     */
    getX: function() {
        return this.options.cx;
    },

    /**
     * Set x
     *
     * @param number x
     */
    setX: function(x) {
        this.options.cx = x;
    },

    /**
     * Get y
     *
     * @return number
     */
    getY: function() {
        return this.options.cy;
    },

    /**
     * Set y
     *
     * @param number y
     */
    setY: function(y) {
        this.options.cy = y;
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
     * @param Subway subway
     */
    setSubway: function(subway) {
        this.subway = subway;
    },

    /**
     * Get node radius
     *
     * @return number
     */
    getNodeRadius: function() {
        return 10;
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
     * Is being changed
     *
     * @return boolean
     */
    isBeingChanged: function() {
        return this.options.dragged;
    },

    /**
     * Moved station
     *
     * @param number x
     * @param number y
     */
    movedStation: function(x, y) {
        this.options.cx = x;
        this.options.cy = y;
    },

    /**
     * Has line
     *
     * @param string id
     * @return boolean
     */
    hasLine: function(id) {
        return this.getLine(id) !== undefined;
    },

    /**
     * Persist station
     */
    persist: function() {
        var linesIds = []
        _.each(this.getLines(), function(value,key) {
            linesIds.push(value.getId());
        });

        var projectId = this.subway.getId();

        if (this._id === undefined) {
            this._id = Items.insert({
                "name": this.name,
                "description": this.description,
                "options.subway":
                    this.options
                ,
                "categories": linesIds,
                "projectId": projectId
            });
        } else {
            var subwayStationProperties = {
                name: this.name,
                description: this.description,
                options: {
                    subway: this.options
                },
                categories: linesIds,
                projectId: projectId
            };
            Items.update(this._id, {$set: subwayStationProperties});
        }
    }
}
