var ObserveStation;

Template.station.rendered = function() {
    var subwayStation = this.data;
    var category = ItemCategories.findOne(subwayStation.categories[0]);
    var gStations = d3.select('#subway-stations');
    var delimiterHeight = 968;
    var delimiterWidth = 1170;
    var margin = 20;
    Meteor.defer(function () {
        if(d3.select('#done').empty()) {
            d3.select('svg').append('div').attr('id', 'done');
        }
    });

    /* Reposition the station coords when it's out of the svg
     *
     * @param delimiterWidth : The size which we don't want to exceed
     * @param margin: A margin for reposition the element
     */
    var repositionStationCoords = function(delimiterWidth, margin, subwayStation) {
        if (d3.event.x < 0) { subwayStation.options.subway.cx = margin };
        if (d3.event.y < 0) { subwayStation.options.subway.cy = margin };
        if (d3.event.x > delimiterWidth) { subwayStation.options.subway.cx = delimiterWidth - margin };
        if (d3.event.y > delimiterHeight) { subwayStation.options.subway.cy = delimiterHeight - margin };
    };


    // Drag Functions
    var dragStation = d3.behavior.drag()
        .on('dragstart', function(subwayStation) {
            Items.update(subwayStation._id, {$set: {'options.subway.dragged': true}});
            d3.select("#tooltip")
                .style("display", "none");
        })
        .on('drag', function(subwayStation) {
            subwayStation.options.subway.cx = (d3.event.x).toFixed();
            subwayStation.options.subway.cy = (d3.event.y).toFixed();
            repositionStationCoords(delimiterWidth, margin, subwayStation);
            d3.select(this).attr("transform", "translate(" + d3.event.x + "," + d3.event.y + ")");
            d3.select("#tooltip")
                .style("display", "none");
        })
        .on('dragend', function(subwayStation) {
            Items.update(subwayStation._id, {$set: {'options.subway.cx': subwayStation.options.subway.cx, 'options.subway.cy': subwayStation.options.subway.cy, 'options.subway.dragged': false}});
            d3.select("#tooltip")
                .style("display", "block")
            ;
        })
    ;

    var dragStationName = d3.behavior.drag()
        .on('drag', function(subwayStation) {
            subwayStation.options.subway.tcx = (d3.event.x).toFixed();
            subwayStation.options.subway.tcy = (d3.event.y).toFixed()y;

            d3.select(this)
                .attr('x', d3.event.x)
                .attr('y', d3.event.y)
            ;
        })
        .on('dragend', function(subwayStation) {
            Items.update(subwayStation._id, {$set: {'options.subway.tcx': subwayStation.options.subway.tcx, 'options.subway.tcy': subwayStation.options.subway.tcy}})
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
                // Define gradient for 
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
            .attr('x', subwayStation.options.subway.tcx)
            .attr('y', subwayStation.options.subway.tcy)
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
                    .on("mouseover", function (document) {
                        d3.select("#tooltip")
                            .style("left", document.options.subway.cx + "px")
                            .style("top", document.options.subway.cy + "px")
                            .style("display", "block")
                            .select("#description")
                            .text(document.description)
                        ;
                    })
                    .on("mouseout", function () {
                        d3.select("#tooltip")
                            .style("display", "none");
                    })
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
                    .attr('x', document.options.subway.tcx)
                    .attr('y', document.options.subway.tcy)
                    .call(dragStationName)
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
