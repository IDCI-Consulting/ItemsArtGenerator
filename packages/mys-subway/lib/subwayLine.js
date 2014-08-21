SubwayLine = function(document) {
    this.document = document;
    this.stations = [];
    this.name = document.name;
    this.description = document.description;
    this.color = this.getOption('color', '#C8C8C8');
}

SubwayLine.prototype = {
    /**
     */
    constructor: SubwayLine,

    /**
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
     */
    addStation: function(station) {
        this.stations.push(station);
    }
}
