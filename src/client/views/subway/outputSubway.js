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
                var moved = d3.select(d3.event.sourceEvent.originalTarget);
                moved
                    .select('circle#' + station._id)
                    .attr('cx', d3.event.x)
                    .attr('cy', d3.event.y)
                ;
            }

            var drawStation = function(station) {
                var dragStation = d3.behavior.drag()
                    .on("drag", moveStation)
                ;

                station.call(dragStation);

                station
                    .attr('class', 'subway-station')
                    .append("svg:circle")
                    .attr("id", function(station) {
                        return station._id;
                    })
                    .attr("cx", function(station) {
                        return station.options.subway.cx;
                    })
                    .attr("cy", function(station) {
                        return station.options.subway.cy;
                    })
                    .attr("r", function(station) {
                        return station.options.subway.r;
                    })
                ;

                station.append("text")
                    .text(function(station) {
                        return station.name;
                    })
                    .attr("x", function(station) {
                        return station.options.subway.cx + 5;
                    })
                    .attr("y", function(station) {
                        return station.options.subway.cy;
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

            var station = outputSubway.selectAll('g.subway-station')
                .data(stations)
                .enter()
                .append('g')
                .call(drawStation)
            ;
        });
    }
};
