Template.outputSubway.helpers({
    lines: function() {
        return ItemCategories.find({projectId: this._id});
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
                    station.options.subway.selected = 'yes';
                    var subwayStation = new SubwayStation(station);
                    subwayStation.setCurrentSelected(station);
                })
                .on('drag', function(station) {
                    var subwayStation = new SubwayStation(station);
                    subwayStation.moveStation(this);
                })
                .on('dragend', function(station) {
                    station.options.subway.selected = 'no';
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

            var updateStations = function(station) {
                station
                    .attr('id', function(station) {
                        return station._id;
                    })
                    .attr('class', 'subway-station')
                    .attr('transform', function(station) {
                        return 'translate(' + [station.options.subway.cx, station.options.subway.cy] + ')';
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

            // Lines
            var line = Meteor.getD3Selection(outputSubway, 'line.links', stations);
            lines
                .enter()
                .append('line')
            ;

            updateStations(station.transition().duration(500));
            station.exit().transition().duration(250).attr('r', 0).remove();
        });
    }
};
