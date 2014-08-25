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
            var moveStation = function(station) {
                d3.select(this)
                  .attr("cy", d3.event.y)
                  .attr("cx", d3.event.x)
                ;
            }

            var drag = d3.behavior.drag()
                .on("drag", moveStation);
            console.log(drag);
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

            d3.select("#output > svg").selectAll('circle').data(Items.find({projectId: self.data._id}).fetch()).enter()
                .append('circle')
                    .attr('id', function(station) {
                        return station._id;
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
                    .call(drag)
            ;
        });
    }
};
