/**
 * SubwayStation
 */
SubwayStation = function(object) {
    this._id = object._id;
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
     * Set being changed on
     */
    setBeingChangedOn: function() {
        this.options.subway.dragged = true;
        Items.update({_id: this._id}, {$set: {options: {subway: this.options.subway}}});
    },

    /**
     * Set being changed off
     */
    setBeingChangedOff: function() {
        this.options.subway.dragged = false;
        Items.update({_id: this._id}, {$set: {options: {subway: this.options.subway}}});
    },

    /**
     * Moved station
     * @param integer x
     * @param integer y
     */
    movedStation: function(x, y) {
        this.options.subway.cx = x;
        this.options.subway.cy = y;
        Items.update({_id: this._id}, {$set: {options: {subway: this.options.subway}}});
    }
}
