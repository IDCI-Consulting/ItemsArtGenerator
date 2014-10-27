var ObserveLine;

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
        var stations = [];
        var line = ItemCategories.findOne({_id: subwayLine._id});
        var items = Items.find({categories: {$in: [subwayLine._id]}}).fetch();
        _.each(line.items, function(itemId, key) {
            _.each(items, function(value, key) {
                if(itemId === value._id) {
                    stations.push(value);
                }
            });
        });
        gLines
            .selectAll('#line-' + subwayLine._id)
            .transition()
            .duration(500)
            .attr('d', function(subwayLine) {
                return lineFunction(stations);
            })
            .style('stroke', function(subwayLine) {
                return subwayLine.options.subway.color;
            })
        ;
        gLegend
            .selectAll('#legend-' + subwayLine._id + ' > span')
            .transition()
            .duration(0)
            .style('background', subwayLine.options.subway.color)
        ;
        gLegend
            .selectAll('#legend-' + subwayLine._id + ' > span > p')
            .text(subwayLine.name)
        ;
    }


    // ItemCategories collection observer
    ObserveLine = ItemCategories.find({_id: subwayLine._id}).observe({
        added: function(document) {
            gLines
                .append('path')
                .datum(document)
                .attr('id', "line-" + document._id)
                .attr('class', 'subway-line')
                .style('stroke', document.options.subway.color)
            ;

            gLegend
                .attr('class', 'inline-list')
                .append('li')
                .datum(document)
                .attr('id', 'legend-line-' + document._id)
                .append('span')
                .style('background', document.options.subway.color)
                .append('p')
                .text(document.name)
            ;
            gLegend
                .select('#legend-line-' + document._id)
                .append('ul')
                .attr('id', 'stations-' + document._id)
                .style('font-size', "7px")
            ;
        },

        changed: function(newDocument, oldDocument) {
            gLines
                .select('#line-' + newDocument._id)
                .datum(newDocument)
            ;
            gLegend
                .select('#legend-' + newDocument._id)
                .datum(newDocument)
            ;
            draw(subwayLine);
        },

        removed: function(oldDocument) {
            gLines
                .select('#line-' + oldDocument._id)
                .remove()
            ;
            gLegend
                .select('#legend-' + oldDocument._id)
                .remove()
            ;
            draw(oldDocument);
        }
    });

    // Items collection observer
    ObserveStation = Items.find({categories: {$in: [subwayLine._id]}}).observe({
        added: function(document) {
            gLegend
                .select('#stations-' + subwayLine._id)
                .datum(document)
                .append('li')
                .attr('id', 'legend-station-' + document._id)
                .style('color', subwayLine.options.subway.color)
                .text(document.name)
            ;
            draw(subwayLine);
        },
        changed: function(newDocument, oldDocument) {
            gLegend
                .select('#legend-station-' + newDocument._id)
                .datum(newDocument)
            ;
            draw(subwayLine);
        },
        removed: function(oldDocument) {
            gLegend
                .select('#legend-station-' + oldDocument._id)
                .remove()
            ;
            draw(subwayLine);
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
