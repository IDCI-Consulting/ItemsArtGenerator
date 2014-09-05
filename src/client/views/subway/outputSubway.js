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
            var stations = Items.find({projectId: self.data._id}).fetch();
            var outputSubway = d3.select('svg').attr('id', 'outputSubway');
            var subwayLegend = d3.select(self.subwayLegend);

            // Transform DATA (subway->getLines() / subway->getStations())
            var subway = new Subway(project);

            _.each(lines, function(lineValue, lineKey) {
                var subwayLine = new SubwayLine(lineValue);
                subwayLine.setSubway(subway);
                subway.addLine(subwayLine);
            });

            _.each(stations, function(stationValue, stationKey) {
                var subwayStation = new SubwayStation(stationValue);
                subwayStation.setSubway(subway);
                _.each(stationValue.categories, function(lineId) {
                    subwayStation.addLine(subway.getLine(lineId));
                });
                subway.addStation(subwayStation);
            });


            // Drawing functions
            var lineFunction = d3.svg.line()
                .x(function(subwayStation) {
                    return subwayStation.getX();
                })
                .y(function(subwayStation) {
                    return subwayStation.getY();
                })
                .interpolate("cardinal")
            ;

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

            var drawStations = function(subwayStations) {
                var stations = outputSubway
                    .selectAll('g.subway-station')
                    .data(d3.values(subwayStations))
                ;
                // d3 enter
                var station = stations.enter().append('g');
                station
                    .attr('id', function(subwayStation) {
                        return subwayStation.getId();
                    })
                    .attr('class', 'subway-station')
                    .attr('transform', function(subwayStation) {
                        return 'translate(' + [subwayStation.getX(),subwayStation.getY()] + ')';
                    })
                    .call(dragStation)
                    .append('svg:circle')
                    .attr('r', function(subwayStation) {
                        return subwayStation.getNodeRadius();
                    })
                ;
                // d3 update
                stations
                    .transition()
                    .duration(500)
                    .attr('class', function(subwayStation) {
                        var c = 'subway-station';
                        if(subwayStation.isBeingChanged()) {
                            c += ' dragged';
                        }
                        return c;
                    })
                    .attr('transform', function(subwayStation) {
                        return 'translate(' + [subwayStation.getX(), subwayStation.getY()] + ')';
                    })
                ;
                station
                    .append('text')
                    .text(function(subwayStation) {
                        return subwayStation.getName();
                    })
                    .attr('x', 10)
                ;
            };

            var drawLines = function(subwayLines) {
                var lines = outputSubway
                    .selectAll('path.subway-line')
                    .data(d3.values(subwayLines))
                ;
                // d3 enter
                lines
                    .enter()
                    .append('svg:path')
                    .attr('id', function(subwayLine) {
                        return subwayLine.getId();
                    })
                    .attr('class', 'subway-line')
                    .attr('d', function(subwayLine) {
                        return lineFunction(d3.values(subwayLine.getStations()));
                    })
                    .style('stroke', function(subwayLine) {
                        return subwayLine.getColor();
                    })
                ;
                // d3 update
                lines
                    .transition()
                    .duration(500)
                    .attr('d', function(subwayLine) {
                        return lineFunction(d3.values(subwayLine.getStations()));
                    })
                    .style('stroke', function(subwayLine) {
                        return subwayLine.getColor();
                    })
                ;
            };

            var drawLegend = function(subwayLines) {
                var legend = outputSubway
                    .selectAll('li')
                    .data(d3.values(subwayLines))
                ;
                // d3 enter
                legend
                    .enter()
                    .append('li')
                    .attr('id', function(subwayLine) {
                        return subwayLine.getId();
                    })
                    .append('span')
                    .style('background', function(subwayLine) {
                        return subwayLine.getColor();
                    })
                    .append('p')
                    .text(function(subwayLine) {
                        return subwayLine.getName();
                    })
                ;
                // d3 update
                legend
                    .select('span')
                    .style('background', function(subwayLine) {
                        return subwayLine.getColor();
                    })
                    .select('p')
                    .text(function(subwayLine) {
                        return subwayLine.getName();
                    })
                ;
            };

            var drawSubway = function(subway) {
                drawStations(subway.getStations());
                drawLines(subway.getLines());
                drawLegend(subway.getLines());
            };


            // Draw
            drawSubway(subway);
        });
    }
};
