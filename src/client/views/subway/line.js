Template.line.helpers({
    stations: function() {
        return Items.find({categories: {$in: [this._id]}});
    }
});

Template.line.rendered = function() {
    var subwayLine = this.data;
    var outputSubway = d3.select('#subway-svg');
    var stations = Items.find({categories: {$in: [subwayLine._id]}}).fetch();

    var selectorId = '#' + subwayLine._id;

    var lineFunction = d3.svg.line()
        .x(function(subwayStation) {
            return subwayStation.options.subway.cx;
        })
        .y(function(subwayStation) {
            return subwayStation.options.subway.cy;
        })
        .interpolate("cardinal")
    ;

    line = outputSubway.selectAll('subway-line');
    lineData = line.data([subwayLine]);
    pathContainer = lineData
        .enter()
        .append('path')
        .attr('id', subwayLine._id)
        .attr('class', 'subway-line')
        .attr('d', lineFunction(stations))
        .style('stroke', subwayLine.options.subway.color)
    ;

    Items.find().observe({
        changed: function(newDocument, oldDocument) {
            Template.line.draw(subwayLine);
        },
        removed: function(id) {
            var selectorId = '#' + id;

            var removingStation = d3.select('#subway-svg').selectAll(selectorId);
            removingStation.remove();
        }
    });
}
