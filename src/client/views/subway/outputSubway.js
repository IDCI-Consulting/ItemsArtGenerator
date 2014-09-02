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

            // Transform DATA (subway->getSubwayLines() / subwayLine->getStations())
            var subway = new Subway(project);
            _.each(lines, function(lineValue, lineKey) {
                var subwayLine = new SubwayLine(lineValue);
                var stations = Items.find({categories: {$in: [subwayLine._id]}}).fetch();
                _.each(stations, function(stationValue, stationKey) {
                    var subwayStation = new SubwayStation(stationValue);
                    var lines = ItemCategories.find({items: {$in: [subwayStation._id]}}).fetch();
                    _.each(lines, function(lineValue, lineKey) {
                        subwayStation.addSubwayLine(lineValue);
                    });
                    subwayLine.addStation(subwayStation);
                });
                subway.addSubwayLine(subwayLine);
            });

            var outputSubway = d3.select('svg');

            // Drawing functions
            var drawStation = function(subwayStation) {
                var group = outputSubway.append('g').datum(subwayStation);
                    group
                        .attr('id', subwayStation.getId())
                        .attr('class', 'subway-station')
                        .attr('transform', 'translate(' + [subwayStation.getX(),subwayStation.getY()] + ')')
                        .append('circle')
                        .attr('r', subwayStation.getNodeRadius())
                    ;
            };

            var drawLine = function(subwayLine) {
                _.each(subwayLine.getStations(), function(value, key) {
                    drawStation(value);
                });
            };

            var drawSubway = function(subway) {
                var subwayLegend = d3.select(self.subwayLegend);

                _.each(subway.getSubwayLines(), function(value, key) {
                    drawLine(value);
                });
            };

            // Draw
            drawSubway(subway);

/*            var dragStation = d3.behavior.drag()
                .on('dragstart', function(station) {
                    var subwayStation = new SubwayStation(station);
                    subwayStation.setBeingChangedOn();
                })
                .on('drag', function(station) {
                    var movingStation = d3.select(this);
                    movingStation
                        .attr("transform", function(station) {
                            return "translate("+ [d3.event.x, d3.event.y] + ")";
                        })
                    ;
                })
                .on('dragend', function(station) {
                    var subwayStation = new SubwayStation(station);
                    subwayStation.setBeingChangedOff();
                    subwayStation.movedStation(d3.event.sourceEvent.layerX, d3.event.sourceEvent.layerY);
                })
            ;

            var line = d3.svg.line()
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
