var ObserveStation;

Template.station.rendered = function(parent) {
    var subwayStation = this.data;
    var category = ItemCategories.findOne(subwayStation.categories[0]);
    var gStations = d3.select('#subway-stations');
    var div = d3.select('.tooltip');
    Meteor.defer(function () {
        if(d3.select('#done').empty()) {
            d3.select('svg').append('div').attr('id', 'done');
        }
    });

    // Drag Functions
    var dragStation = d3.behavior.drag()
        .on('dragstart', function(subwayStation) {
            Items.update(subwayStation._id, {$set: {options: {subway: {cx: subwayStation.options.subway.cx, cy: subwayStation.options.subway.cy, dragged: true}}}});
        })
        .on('drag', function(subwayStation) {
            d3.select(this).attr("transform", "translate(" + d3.event.x + "," + d3.event.y + ")");
        })
        .on('dragend', function(subwayStation) {
            Items.update(subwayStation._id, {$set: {options: {subway: {cx: d3.event.sourceEvent.layerX, cy: d3.event.sourceEvent.layerY, dragged: false}}}});
        })
    ;

    // Draw station
    var draw = function(subwayStation) {
        var gContainer = gStations
            .selectAll('#station-' + subwayStation._id)
            .transition()
            .duration(500)
            .attr('class', function(subwayStation) {
                var c = 'subway-station';
                if(subwayStation.options.subway.dragged) {
                    c += ' dragged';
                }
                return c;
            })
            .attr('transform', 'translate(' + [subwayStation.options.subway.cx,subwayStation.options.subway.cy] + ')')
        ;
        gContainer
            .select('circle')
            .attr('stroke', function(subwayStation) {
                if (subwayStation.categories.length > 1) {
                    var n = 100 / (subwayStation.categories.length - 1)
                    var gradient = d3.select('defs')
                        .append("linearGradient")
                        .attr("id", "gradient-" + subwayStation._id)
                        .attr("x1", "0%")
                        .attr("y1", "0%")
                        .attr("x2", "100%")
                        .attr("y2", "0%")
                        .attr("spreadMethod", "pad")
                    ;
                    _.each(subwayStation.categories, function(categoryId, key) {
                        var category = ItemCategories.findOne(categoryId);
                        gradient
                            .append('stop')
                            .attr('offset', n * key + "%")
                            .attr('stop-color', category.options.subway.color)
                            .attr('stop-opacity', 1)
                        ;
                    });
                    return 'url(#gradient-' + subwayStation._id + ')';
                }

                return category.options.subway.color;
            })
            .attr('r', 8 + (subwayStation.categories.length - 1) * 4)
        ;
        gContainer
            .select('text')
            .attr('x', 10 + (subwayStation.categories.length - 1) * 4)
            .text(subwayStation.name)
        ;
    };

    // Items collection observer
    ObserveStation = Items.find({_id: subwayStation._id}).observe({
        added: function(document) {
            if(d3.select('#station-' + document._id).empty()) {

                var gContainer = gStations
                    .append('g')
                    .datum(document)
                    .attr('id', 'station-' + document._id)
                    .attr('class', 'subway-station')
                    .attr('transform', 'translate(' + [document.options.subway.cx,document.options.subway.cy] + ')')
                    .call(dragStation)
                ;
                gContainer
                    .append('circle')
                    .attr('stroke', function(subwayStation) {
                        if (subwayStation.categories.length > 1) {
                            var n = 100 / (subwayStation.categories.length - 1)
                            var gradient = d3.select('defs')
                                .append("linearGradient")
                                .attr("id", "gradient-" + subwayStation._id)
                                .attr("x1", "0%")
                                .attr("y1", "0%")
                                .attr("x2", "100%")
                                .attr("y2", "0%")
                                .attr("spreadMethod", "pad")
                            ;
                            _.each(subwayStation.categories, function(categoryId, key) {
                                var category = ItemCategories.findOne(categoryId);
                                gradient
                                    .append('stop')
                                    .attr('offset', n * key + "%")
                                    .attr('stop-color', category.options.subway.color)
                                    .attr('stop-opacity', 1)
                                ;
                            });
                            return 'url(#gradient-' + subwayStation._id + ')';
                        }

                        return category.options.subway.color;
                    })
                    .attr('r', 8 + (document.categories.length - 1) * 4)
                ;
                gContainer
                    .append('text')
                    .text(document.name)
                    .attr('x', 10 + (document.categories.length - 1) * 4)
                ;
            }
        },

        changed: function(newDocument, oldDocument) {
            gStations
                .select('#station-' + newDocument._id)
                .datum(newDocument)
            ;
            draw(newDocument);
        },

        removed: function(oldDocument) {
            gStations
                .select('#station-' + oldDocument._id)
                .remove()
            ;
            draw(oldDocument);
        }
    });
};

// Stop observing station when the template is destroyed
Template.station.destroyed = function(){
    if(ObserveStation) {
        ObserveStation.stop();
    }
};
