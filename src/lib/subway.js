/**
 * Subway
 */
var Subway = function() {

};

    /***********************************************************************/
    /***********************************************************************/

/**
 * SubwayLine
 */
var SubwayLine = function(object) {
    this.name = object.name;
    this.description = object.description;
    this.options = object.options;
};

/**
 * Get options
 *
 * @return object
 */
SubwayLine.prototype.getOptions = function(options) {
    try {
        var dataOptions = JSON.parse(options);
    } catch(e) {
        console.error("Parsing error:", e);
    }

    if (dataOptions.color === undefined) {
        dataOptions.color = "#FF0000";

        return dataOptions;
    } else {
        return dataOptions;
    }
}

    /***********************************************************************/
    /***********************************************************************/

/**
 * SubwayLineStation
 */
var SubwayLineStation = function(object) {
    this.object = object;
};

/**
 * Get options
 *
 * @return object
 */
SubwayLineStation.prototype.getOptions = function(options) {
    try {
        var dataOptions = JSON.parse(options);
    } catch(e) {
        console.error("Parsing error:", e);
    }

    if (dataOptions.coords === undefined) {
        dataOptions.coords.x = 1;
        dataOptions.coords.y = 1;

        return dataOptions;
    } else {
        return dataOptions;
    }
}
