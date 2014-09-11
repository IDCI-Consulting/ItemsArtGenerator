Template.outputSubway.helpers({
    stations: function() {
        return Items.find({projectId: this._id});
    },
    lines: function() {
        return ItemCategories.find({projectId: this._id});
    }
});

Template.outputSubway.rendered = function() {
    var self = this;
    if(! self.handle) {
        self.handle = Deps.autorun(function() {
            var subwayLines = ItemCategories.find({projectId: self.data._id}).fetch();
            var outputSubway = d3.select('#subway-svg');

            // Get path coords
            var lineFunction = d3.svg.line()
                .x(function(subwayStation) {
                    return subwayStation.options.subway.cx;
                })
                .y(function(subwayStation) {
                    return subwayStation.options.subway.cy;
                })
                .interpolate("cardinal")
            ;

            // Update
            var update = function() {
                outputSubway
                    .selectAll('path.subway-line')
                    .data(subwayLines)
                    .transition()
                    .duration(500)
                    .attr('d', function(subwayLine) {
                        var stations = Items.find({categories: {$in: [subwayLine._id]}}).fetch();
                        return lineFunction(stations);
                    })
                    .style('stroke', function(subwayLine) {
                        return subwayLine.options.subway.color;
                    })
                ;
            };

            // Select
            line = outputSubway.selectAll('path');
            lineData = line.data(subwayLines);

            // Enter
            pathContainer = lineData
                .enter()
                .append('path')
                .attr('id', function(subwayLine) {
                    return subwayLine._id;
                })
                .attr('class', 'subway-line')
                .attr('d', function(subwayLine) {
                    var stations = Items.find({categories: {$in: [subwayLine._id]}}).fetch();
                    return lineFunction(stations);
                })
                .style('stroke', function(subwayLine) {
                    return subwayLine.options.subway.color;
                })
            ;

            // Delete
            lineData
                .exit()
                .remove()
            ;

            update();
        });
    }
};

// Stop the autorun when the template is destroyed
Template.outputSubway.destroyed = function () {
    if(this.handle) {
        this.handle.stop();
    }
};
