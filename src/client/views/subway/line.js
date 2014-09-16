var ObserveLine;

Template.line.helpers({
    stations: function() {
        return Items.find({categories: {$in: [this._id]}});
    }
});

Template.line.rendered = function() {
    var subwayLine = this.data;
    var gLines = d3.select('#subway-lines');
    var gLegend = d3.select('#subway-legend > ul');

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
        gLines
            .selectAll('#line-' + subwayLine._id)
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

    // Items collection observer
    ObserveStation = Items.find({categories: {$in: [subwayLine._id]}}).observe({
        added: function(docuement) {
            draw(subwayLine);
        },
        changed: function(newDocument, oldDocument) {
            draw(subwayLine);
        },
        removed: function(oldDocument) {
            draw(subwayLine);
        }
    });

    // ItemCategories collection observer
    ObserveLine = ItemCategories.find({_id: subwayLine._id}).observe({
        added: function(document) {
            gLines
                .append('path')
                .datum(document)
                .attr('id', "line-" + document._id)
                .attr('class', 'subway-line')
                .attr('d', function(subwayLine) {
                    var stations = Items.find({categories: {$in: [subwayLine._id]}}).fetch();
                    return lineFunction(stations);
                })
                .style('stroke', document.options.subway.color)
            ;

            gLegend
                .append('li')
                .attr('id', 'legend-' + document._id)
                .append('span')
                .style('background', document.options.subway.color)
                .append('p')
                .text(document.name)
            ;
        },

        changed: function(newDocument, oldDocument) {
            gLines
                .select('#line-' + newDocument._id)
                .datum(newDocument)
            ;
            draw(subwayLine);
        },

        removed: function(oldDocument) {
            gLines
                .select('#line-' + oldDocument._id)
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
