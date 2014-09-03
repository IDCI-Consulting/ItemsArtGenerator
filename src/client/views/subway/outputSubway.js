Template.outputSubway.helpers({
    lines: function() {
        return ItemCategories.find({projectId: this._id});
    }
});

// Retrieve the x,y coords of double click
var coordsRelativeToStation = function (element, e) {
    var offset = $(element).offset();
    var x = e.pageX - offset.left;
    var y = e.pageY - offset.top;
    return { cx: x, cy: y };
};

Template.outputSubway.events({
    'dblclick .outputSubway': function (e, template) {
        e.preventDefault();

        var coords = coordsRelativeToStation(e.currentTarget, e);
        var instance = UI.renderWithData(Template.itemCreate, {'projectId': template.data._id});
        Meteor.loadModal(instance);
    }
});

Template.outputSubway.rendered = function() {
    var self = this;
    self.subwayLegend = self.find('#subway-legend > ul');
    self.node = self.find('svg');

    if(! self.handle) {
        self.handle = Deps.autorun(function() {
            // Retrieve DATA
            var project = self.data;
            var lines = ItemCategories.find({projectId: self.data._id}).fetch();
            var outputSubway = d3.select('svg').attr('id', 'outputSubway');

            // Transform DATA (subway->getSubwayLines() / subwayLine->getStations())
            var subway = new Subway(project);
            _.each(lines, function(lineValue, lineKey) {
                var subwayLine = new SubwayLine(lineValue);
                var stations = Items.find({categories: {$in: [subwayLine._id]}}).fetch();
                _.each(stations, function(stationValue, stationKey) {
                    var subwayStation = new SubwayStation(stationValue);
                    var lines = ItemCategories.find({items: {$in: [subwayStation._id]}}).fetch();
                    _.each(lines, function(lineValue, lineKey) {
                        var subwayLine = new SubwayLine(lineValue)
                        subwayStation.addSubwayLine(subwayLine);
                        subwayStation.setProject(subway);
                    });
                    subwayLine.addStation(subwayStation);
                });
                subway.addSubwayLine(subwayLine);
            });

            // Drawing functions

            var lineFunction = d3.svg.line()
                .x(function(subwayStation) {
                    return subwayStation.getX();
                })
                .y(function(subwayStation) {
                    return subwayStation.getY();
                })
                .interpolate("cardinal");

            var updateStations = function(stations) {
                stations
                    .transition()
                    .duration(500)
                    .attr('class', function(subwayStation) {
                        var c = 'subway-station';
                        if(subwayStation.isBeingChanged())
                            c += ' dragged';
                        return c;
                    })
                    .attr('transform', function(subwayStation) {
                        return 'translate(' + [subwayStation.getX(), subwayStation.getY()] + ')';
                    })
                ;
            }

            var drawStation = function(station) {
                station
                    .attr('class', 'subway-station')
                    .attr('transform', function(subwayStation) {
                        return 'translate(' + [subwayStation.getX(),subwayStation.getY()] + ')';
                    })
                    .call(dragStation)
                    .append('svg:circle')
                    .attr('r', function(subwayStation) {
                        return subwayStation.getNodeRadius()
                    })
                ;
                station
                    .append('text')
                    .text(function(subwayStation) {
                        return subwayStation.getName();
                    })
                    .attr('x', 10)
            };

            var drawLine = function(subwayLine) {
                outputSubway
                    .append("path")
                    .attr('class', 'subway-line')
                    .attr("d", lineFunction(subwayLine.getStations()))
                    .attr("stroke", subwayLine.getColor())
                ;
                var stations = outputSubway.selectAll('g.subway-station')
                    .data(subwayLine.getStations())
                ;
                stations
                    .enter()
                    .append('g')
                    .call(drawStation)
                ;

            };

            var drawSubway = function(subway) {
                var subwayLegend = d3.select(self.subwayLegend);
                _.each(subway.getSubwayLines(), function(value, key) {
                    drawLine(value);
                });
            };

            // Define drag behavior

            var dragStation = d3.behavior.drag()
                .on('dragstart', function(subwayStation) {
                    subwayStation.setBeingChangedOn();
                    subwayStation.persist();
                })
                .on('drag', function(subwayStation) {
                    d3.select(this).attr("transform", "translate(" + d3.event.x + "," + d3.event.y + ")");
                })
                .on('dragend', function(subwayStation) {
                    subwayStation.setX(d3.event.sourceEvent.layerX);
                    subwayStation.setY(d3.event.sourceEvent.layerY);
                    subwayStation.setBeingChangedOff();
                    subwayStation.persist();
                })
            ;

            // Draw
            drawSubway(subway);
/*            var line = d3.svg.line()
                .x(function(station) {
                    return station.options.subway.cx;
                })
                .y(function(station) {
                    return station.options.subway.cy;
                })
                .interpolate("cardinal")
            ;

            var drawLine = function(subwayLine) {
                for(var i = 0, l = subwayLine.getStations(); i < l; i++) {
                    outputSubway
                        .append('path')
                        .attr('class', 'subway-line')
                        .attr('d', line(subwayLine.getStations()))
                        .attr('stroke', subwayLine.options.subway.color)
                    ;
                }
            };
*/
        });
    }
};
