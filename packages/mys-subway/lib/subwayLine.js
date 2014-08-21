/**
 * SubwayLine
 */
SubwayLine = function(document) {
    this.document = document;
    this.stations = [];
    this.name = document.name;
    this.description = document.description;
    this.color = this.getOption('color', '#C8C8C8');
}

SubwayLine.prototype = {
    /**
     * Constructor
     */
    constructor: SubwayLine,

    /**
     * Get option
     *
     * @param string key
     * @param mixed _default
     * @return mixed
     */
    getOption: function(key, _default) {
        _default = typeof _default !== 'undefined' ? _default : 'undefined';

        if (!key) {
            return _default;
        }

        var value = this.document.options[key];

        if (!value) {
            return _default;
        }

        return value;
    },

    /**
     * Add station
     * @param station
     * 
     */
    addStation: function(station) {
        this.stations.push(station);
    }
}
