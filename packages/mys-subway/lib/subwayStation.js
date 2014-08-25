/**
 * SubwayStation
 */
SubwayStation = function(document) {
    this.document = document;
    this.name = document.name;
    this.description = document.description;
    this.coords = this.getOption('coords', {
        x: 2,
        y: 8
    })
}

SubwayStation.prototype = {
    /**
     * Constructor
     */
    constructor: SubwayStation,

    /**
     * Get option
     *
     * @param key
     * @param _default
     * @return mixed
     */
    getOption: function(key, _default) {
        _default = typeof _default !== 'undefined' ? _default : 'undefined';

        if (!key) {
            return _default;
        }

        var value = this.document.options.subway[key];

        if (!value) {
            return _default;
        }

        return value;
    }
}
