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

            var moveStation = function(station) {
                d3.select(this)
                  .attr("cy", d3.event.y)
                  .attr("cx", d3.event.x)
                ;
                link
                    .attr("x1", function(station, index) {
                        return station.options.subway.cx;
                    })
                    .attr("y1", function(station, index) {
                        return station.options.subway.cy;
                    })
                    .attr("x2", function(station, index) {
                        if(stations[index+1] !== undefined) {
                            return stations[index+1].options.subway.cx;
                        } else {
                            return station.options.subway.cx;
                        }
                    })
                    .attr("y2", function(station, index) {
                        if(stations[index+1] !== undefined) {
                            return stations[index+1].options.subway.cy;
                        } else {
                            return station.options.subway.cy;
                        }
                    })
                ;
            }

            var drag = d3.behavior.drag()
                .on("drag", moveStation);

            d3.select("#subway-legend > ul").selectAll('li').data(ItemCategories.find({projectId: self.data._id}).fetch()).enter()
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

             var link = d3.select("#output > svg").selectAll(".line")
               .data(stations, function(station, index) {
                    return index;
                })
               .enter()
               .append("line")
                .attr("fill", "none")
                .attr("x1", function(station, index) {
                    return station.options.subway.cx;
                })
                .attr("y1", function(station, index) {
                    return station.options.subway.cy;
                })
                .attr("x2", function(station, index) {
                    if(stations[index+1] !== undefined) {
                        return stations[index+1].options.subway.cx;
                    } else {
                        return station.options.subway.cx;
                    }
                })
                .attr("y2", function(station, index) {
                    if(stations[index+1] !== undefined) {
                        return stations[index+1].options.subway.cy;
                    } else {
                        return station.options.subway.cy;
                    }
                })
                .style("stroke", "rgb(6,120,155)")
            ;

            d3.select("#output > svg").selectAll('circle').data(stations).enter()
                .append('circle')
                    .attr('id', function(station) {
                        return station._id;
                    })
                .on("mouseout", function(station){
                    station.options.subway.cx = d3.select(this).attr("cx");
                    station.options.subway.cy = d3.select(this).attr("cy");
                    console.log(station.options.subway);
                    ;
                })
                    .attr('data-name', function(station) {
                        return station.name;
                    })
                    .attr("r", function(station) {
                        return station.options.subway.r;
                    })
                    .attr("cx", function(station) {
                        return station.options.subway.cx;
                    })
                    .attr("cy", function(station) {
                        return station.options.subway.cy;
                    })
                    .attr("class", "subway-station")
                    .text(function(station) {
                        return station.name;
                    })
                    .call(drag)
            ;

        });
    }
};
