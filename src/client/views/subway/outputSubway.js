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
            var stations = Items.find({projectId: self.data._id}).fetch();
            var lines = ItemCategories.find({projectId: self.data._id}).fetch();
            var outputSubway = d3.select('svg').attr('id', 'outputSubway');
            var subwayLegend = d3.select(self.subwayLegend);

            // Transform DATA (subway->getSubwayLines() / subway->getStations())
            var subway = new Subway(project);

            _.each(lines, function(lineValue, lineKey) {
                var subwayLine = new SubwayLine(lineValue);
                var s = Items.find({categories: {$in: [subwayLine.getId()]}}).fetch();
                _.each(s, function(stationValue, stationKey) {
                    var subwayStation = new SubwayStation(stationValue);
                    subwayStation.addSubwayLine(subwayLine);
                    subwayStation.setProject(subway);
                });
                subway.addSubwayLine(subwayLine);
            });

            console.log(stations);

            // Drawing functions
            var lineFunction = d3.svg.line()
                .x(function(subwayLine) {
                })
                .y(function(subwayLine) {
                })
                .interpolate("cardinal");

            var drawStations = function(subwayStations) {
                var stations = outputSubway.selectAll('g.subway-station').data(subwayStations);
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
                var station = stations.enter().append('g');
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
                ;
                stations
                    .exit()
                    .remove()
                ;
            };

            var drawLines = function(subwayLines) {
                var lines = outputSubway.selectAll('path.subway-line').data(subwayLines);
                lines
                    .attr('d', lineFunction(subwayLines))
                    .style('stroke', function(subwayLine) {
                        return subwayLine.getColor();
                    })
                ;
                lines
                    .enter()
                    .append('svg:path')
                    .attr('class', 'subway-line')
                    .attr('d', lineFunction(subwayLines))
                    .style('stroke', function(subwayLine) {
                        return subwayLine.getColor();
                    })
                ;
                lines
                    .exit()
                    .remove()
                ;
            };

            var drawLegend = function(a) {
                return 'bouh';
            };

            var drawSubway = function(subway) {
                //drawStations(subway.getStations());
                drawLines(subway.getSubwayLines());
                drawLegend(subway.getSubwayLines());
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
        });
    }
};
