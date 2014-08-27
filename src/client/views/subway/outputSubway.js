Template.outputSubway.helpers({
    lines: function() {
        return ItemCategories.find({projectId: this._id});
    }
});

Template.outputSubway.rendered = function() {
    var self = this;
    self.subwayLegend = self.find("#subway-legend > ul");
    self.node = self.find("#output > svg");

    if(! self.handle) {
        self.handle = Deps.autorun(function() {
            var stations = Items.find({projectId: self.data._id}).fetch();
            var outputSubway = d3.select("#output > svg");
            var subwayLegend = d3.select("#subway-legend > ul");

            var moveStation = function(station) {
                station.options.subway.cx += d3.event.x;
                station.options.subway.cy += d3.event.y;

                var moved = d3.select(this);
                moved
                    .attr("transform", function(station) {
                        station.options.subway.cx = d3.event.x;
                        station.options.subway.cy = d3.event.y;
                        return "translate("+ [station.options.subway.cx,station.options.subway.cy] + ")";
                    })
                ;
            }

            var insertNewStationCoords = function(station) {
                Items.update({_id: station._id}, {$set: {options: {subway: station.options.subway}}});
            }

            var drawStation = function(station) {
                var dragStation = d3.behavior.drag()
                    .on("drag", moveStation)
                    .on("dragend", insertNewStationCoords)
                ;

                station
                    .call(dragStation)
                    .attr('class', 'subway-station')
                    .attr("transform", function(station) {
                        return "translate(" + [station.options.subway.cx,station.options.subway.cy] + ")";
                    })
                ;
                station
                    .append("svg:circle")
                    .attr("id", function(station) {
                        return station._id;
                    })
                    .attr("r", function(station) {
                        return station.options.subway.r;
                    })
                ;

                station.append("text")
                    .attr("id", function(station) {
                        return station._id;
                    })
                    .text(function(station) {
                        return station.name;
                    })
                    .attr("x", function(station) {
                        return 10;
                    })
                    .attr("fill", "black")
                    .attr("font-size", function(station) {
                        return  "1em";
                    })
                    .attr("text-anchor", function(station, index) {
                        if (index > 0) {
                            return  "beginning";
                        } else {
                            return "end";
                        }
                    })
                ;
            }

            // Draw Legend
            subwayLegend.selectAll('li').data(ItemCategories.find({projectId: self.data._id}).fetch()).enter()
                .append("li")
                    .attr("id", function(line) {
                        return line._id;
                    })
                    .append("span")
                        .style("background", function(line) {
                            return line.options.subway.color;
                        })
                    .append("p")
                        .text(function(line) {
                            return line.name;
                        })
            ;

            // Draw Stations
            var station = outputSubway.selectAll('g.subway-station')
                .data(stations, function(station) {
                    return station._id;
                })
            ;
            station
                .enter()
                .append('g')
                .call(drawStation)
            ;
        });
    }
};
