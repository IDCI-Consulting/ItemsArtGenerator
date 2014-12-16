var ObserveStation;

Template.station.rendered = function() {
    var subwayStation = this.data;
    var line = ItemCategories.findOne(subwayStation.categories[0]);
    var gStations = d3.select('#subway-stations');
    var margin = 20;

    /* Reposition the station coords when it's out of the svg
     *
     * @param delimiterWidth : The size which we don't want to exceed
     * @param margin: A margin for reposition the element
     */
    var repositionStationCoords = function(WidthDelimiter, HeightDelimiter, margin, subwayStation) {
        if (d3.event.x < 0) { subwayStation.options.subway.cx = margin }
        if (d3.event.y < 0) { subwayStation.options.subway.cy = margin }
        if (d3.event.x > WidthDelimiter) { subwayStation.options.subway.cx = WidthDelimiter - margin }
        if (d3.event.y > HeightDelimiter) { subwayStation.options.subway.cy = HeightDelimiter - margin }
    };

    // Drag Functions
    var dragStation = d3.behavior.drag()
        .on('dragstart', function(subwayStation) {
            Items.update(subwayStation._id, {$set: {'options.subway.dragged': true}});
            d3.select("#tooltip")
                .style("display", "none")
            ;
        })
        .on('drag', function(subwayStation) {
            subwayStation.options.subway.cx = (d3.event.x).toFixed();
            subwayStation.options.subway.cy = (d3.event.y).toFixed();
            repositionStationCoords(WidthDelimiter, HeightDelimiter, margin, subwayStation);
            d3.select(this).attr("transform", "translate(" + d3.event.x + "," + d3.event.y + ")");
            d3.select("#tooltip")
                .style("display", "none")
            ;
        })
        .on('dragend', function(subwayStation) {
            Items.update(subwayStation._id, {$set: {'options.subway.cx': subwayStation.options.subway.cx, 'options.subway.cy': subwayStation.options.subway.cy, 'options.subway.dragged': false}});
            d3.select("#tooltip")
                .style("display", "block")
            ;
        })
    ;

    var dragStationName = d3.behavior.drag()
        .on('dragstart', function() {
            d3.select("#tooltip")
                .style("display", "none")
            ;
        })
        .on('drag', function(subwayStation) {
            subwayStation.options.subway.tcx = (d3.event.x).toFixed();
            subwayStation.options.subway.tcy = (d3.event.y).toFixed();

            d3.select(this)
                .attr('x', d3.event.x)
                .attr('y', d3.event.y)
            ;

            d3.select("#tooltip")
                .style("display", "none")
            ;
        })
        .on('dragend', function(subwayStation) {
            Items.update(subwayStation._id, {$set: {'options.subway.tcx': subwayStation.options.subway.tcx, 'options.subway.tcy': subwayStation.options.subway.tcy}})
            d3.select("#tooltip")
                .style("display", "block")
            ;
        })
    ;

    // Draw station
    var draw = function(subwayStation) {
        var station = Items.findOne(subwayStation._id);
        var subwayLine = ItemCategories.findOne(line._id);

        if(station) {
            var gContainer = gStations
                .selectAll('#station-' + station._id)
                .transition()
                .duration(500)
                .attr('class', function(station) {
                    var c = 'subway-station';
                    if(station.options.subway.dragged) {
                        c += ' dragged';
                    }
                    return c;
                })
                .attr('transform', 'translate(' + [station.options.subway.cx,station.options.subway.cy] + ')')
            ;
            gContainer
                .select('circle')
                .attr('stroke', function(station) {
                    // Define gradient for intersection
                    if (station.categories.length > 1) {
                        var n = 100 / (station.categories.length - 1);
                        var gradient = d3.select('#gradient-' + station._id);
                        _.each(station.categories, function(categoryId, key) {
                            var category = ItemCategories.findOne(categoryId);
                            gradient
                                .select('#line-gradient-' + category._id)
                                .attr('offset', n * key + "%")
                                .attr('stop-color', category.options.subway.color)
                                .attr('stop-opacity', 1)
                            ;
                        });
                        return 'url(#gradient-' + station._id + ')';
                    }

                    return subwayLine.options.subway.color;
                })
                .attr('r', 8 + (station.categories.length - 1) * 4)
            ;
            gContainer
                .select('text')
                .attr('x', station.options.subway.tcx)
                .attr('y', station.options.subway.tcy)
                .text(station.name)
            ;
        }
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
                    .on("mouseover", function (document) {
                        var tooltipLeftPosition = d3.event.pageX + 10;
                        var tooltipTopPosition = d3.event.pageY - 50;
                        d3.select("#tooltip")
                            .style("left", tooltipLeftPosition + "px")
                            .style("top", tooltipTopPosition + "px")
                            .style("display", "block")
                            .select("#description")
                            .text(document.description)
                        ;
                    })
                    .on("mouseout", function () {
                        d3.select("#tooltip")
                            .style("display", "none");
                    })
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
                                    .attr('id', 'line-gradient-' + category._id)
                                    .attr('offset', n * key + "%")
                                    .attr('stop-color', category.options.subway.color)
                                    .attr('stop-opacity', 1)
                                ;
                            });
                            return 'url(#gradient-' + subwayStation._id + ')';
                        }

                        return line.options.subway.color;
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

    // ItemCategories collection observer
    ObserveLine = ItemCategories.find(line._id).observe({
        changed: function(newDocument, oldDocument) {
            draw(subwayStation);
        }
    });
};

// Stop observing station when the template is destroyed
Template.station.destroyed = function(){
    if(ObserveStation) {
        ObserveStation.stop();
    }
};
