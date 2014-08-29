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
            var stations = Items.find({projectId: self.data._id}).fetch();
            var lines = ItemCategories.find({projectId: self.data._id}).fetch();
            var outputSubway = d3.select('svg');
            var subwayLegend = d3.select(self.subwayLegend);

            /*
             * Drag Station
             */
            var dragStation = d3.behavior.drag()
                .on('dragstart', function(station) {
                    //station.options.subway.dragged = true;
                    var subwayStation = new SubwayStation(station);
                    subwayStation.setCurrentSelected(station);
                })
                .on('drag', function(station) {
                    var subwayStation = new SubwayStation(station);
                    subwayStation.moveStation(this);
                })
                .on('dragend', function(station) {
                    station.options.subway.dragged = true;
                    var subwayStation = new SubwayStation(station);
                    subwayStation.insertNewStationCoords(station);
                })
            ;

            /*
             * Draw group circle & text for each station(item)
             */
            var drawStation = function(station) {
                station
                    .call(dragStation)
                    .attr('id', function(station) {
                        return station._id;
                    })
                    .attr('class', 'subway-station')
                    .attr('transform', function(station) {
                        return 'translate(' + [station.options.subway.cx,station.options.subway.cy] + ')';
                    })
                ;

                station
                    .append('svg:circle')
                    .attr('r', function(station) {
                        return station.options.subway.r;
                    })
                ;

                station.append('text')
                    .text(function(station) {
                        return station.name;
                    })
                    .attr('x', function(station) {
                        return 10;
                    })
                    .attr('fill', 'black')
                    .attr('font-size', function(station) {
                        return  '1em';
                    })
                    .attr('text-anchor', function(station, index) {
                        if (index > 0) {
                            return  'beginning';
                        } else {
                            return 'end';
                        }
                    })
                ;
            };

            /*
             * Draw a li for each line(itemCategory)
             */
            var drawLegend = function(line) {
                line
                    .attr('id', function(line) {
                        return line._id;
                    })
                    .append('span')
                    .style('background', function(line) {
                        return line.options.subway.color;
                    })
                    .append('p')
                    .text(function(line) {
                        return line.name;
                    })
                ;
            };

            /*
             * Update g values with new data coords
             */

            var updateStations = function(stations) {
                console.log("toto");
                stations
                    .attr('id', function(station) {
                        return station._id;
                    })
                    .attr('class', 'subway-station')
                    .attr('transform', function(station) {
                        return 'translate(' + [station.options.subway.cx, station.options.subway.cy] + ')';
                    })
                station
                    .attr("fill", function(station) {
                        if(station.options.subway.dragged)
                            return "rgba(80, 80, 180, 0.8)";
                    })
                ;
            }

            /*
             * Draw the outputSubway elements
             */

            // Legend
            var legend = Meteor.getD3Selection(subwayLegend, 'li', lines);
            legend
                .enter()
                .append('li')
                .call(drawLegend)
            ;

            // Stations
            var station = Meteor.getD3Selection(outputSubway, 'g.subway-station', stations);
            station
                .enter()
                .append('g')
                .call(drawStation)
            ;
            var circles = Meteor.getD3Selection(outputSubway, 'g.subway-station > circle', stations);

            updateStations(station.transition().duration(500));
            station.exit().transition().duration(250).attr('r', 0).remove();
        });
    }
};
