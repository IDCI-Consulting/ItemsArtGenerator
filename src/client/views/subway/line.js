var ObserveLine;

Template.line.helpers({
    stations: function() {
        return Items.find({categories: {$in: [this._id]}});
    }
});

Template.line.rendered = function() {
    var subwayLine = this.data;
    var id = "line-a" + subwayLine._id;
    var selectorId = '#' + id;
    var outputSubway = d3.select('#subway-svg');

    // Get path coords
    var lineFunction = d3.svg.line()
        .x(function(subwayStation) {
            return subwayStation.options.subway.cx;
        })
        .y(function(subwayStation) {
            return subwayStation.options.subway.cy;
        })
        .interpolate("linear")
    ;

    // Draw line with new station coords
    var draw = function(subwayLine) {
        var stations = Items.find({categories: {$in: [subwayLine._id]}}).fetch();
        outputSubway
            .selectAll('#line-a' + subwayLine._id)
            .transition()
            .duration(500)
            .attr('d', function(subwayLine) {
                var stations = Items.find({categories: {$in: [subwayLine._id]}}).fetch();
                return lineFunction(stations);
            })
            .style('stroke', function(subwayLine) {
                return subwayLine.options.subway.color;
            })
    }

    // Select
    line = outputSubway.selectAll(selectorId);
    lineData = station.data([subwayLine]);

    // Enter
    pathContainer = lineData
        .enter()
        .append('path')
        .attr('id', id)
        .attr('class', 'subway-line')
        .attr('d', function(subwayLine) {
            var stations = Items.find({categories: {$in: [subwayLine._id]}}).fetch();
            return lineFunction(stations);
        })
        .style('stroke', subwayLine.options.subway.color)
    ;

    // Items collection observer
    ObserveStation = Items.find({categories: {$in: [subwayLine._id]}}).observe({
        changed: function(newDocument, oldDocument) {
            outputSubway
                .select('#line-a' + newDocument._id)
                .datum(newDocument)
            ;
            draw(subwayLine);
        },
        removed: function(oldDocument) {
            outputSubway
                .select('#line-a' + oldDocument._id)
                .remove()
            ;
            draw(subwayLine);
        }
    });

    // ItemCategories collection observer
    ObserveLine = ItemCategories.find({_id: subwayLine._id}).observe({
        changed: function(newDocument, oldDocument) {
            outputSubway
                .select('#line-a' + newDocument._id)
                .datum(newDocument)
            ;
            draw(subwayLine);
        },
        removed: function(oldDocument) {
            outputSubway
                .select('#a' + oldDocument._id)
                .remove()
            ;
            draw(oldDocument);
        }
    });
};

// Stop observing station and line when the template is destroyed
Template.line.destroyed = function(){
    if(ObserveStation && ObserveLine) {
        ObserveLine.stop();
        ObserveStation.stop();
    }
};
