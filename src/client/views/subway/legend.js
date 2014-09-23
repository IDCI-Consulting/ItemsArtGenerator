Template.legend.rendered = function() {
    var self = this;
    if(! self.handle) {
        self.handle = Deps.autorun(function() {
            var subwayLines = ItemCategories.find({projectId: self.data._id}).fetch();
            var stations = Items.find({projectId: self.data._id}).fetch();
            var subwayLegend = d3.select('#subway-legend');

            var legend = subwayLegend
                .select('ul')
                .selectAll('li')
                .data(subwayLines)
            ;
            // d3 enter
            legend
                .enter()
                .append('li')
                .attr('id', "legend-line-" + function(subwayLine) {
                    return subwayLine._id;
                })
                .append('span')
                .style('background', function(subwayLine) {
                    return subwayLine.options.subway.color;
                })
                .append('p')
                .text(function(subwayLine) {
                    return subwayLine.name;
                })
            ;

            // d3 update
            legend
                .select('span')
                .style('background', function(subwayLine) {
                    return subwayLine.options.subway.color;
                })
                .select('p')
                .text(function(subwayLine) {
                    return subwayLine.name;
                })
            ;
        });
    }
};
