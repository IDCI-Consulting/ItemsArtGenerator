Template.projectRaw.helpers({
    lines: function() {
        return ItemCategories.find({projectId: this._id});
    }
});

Template.projectRaw.legendSVG = function() {
    var self = this;
    if(! self.handle) {
        self.handle = Deps.autorun(function() {
            var subwayLines = ItemCategories.find({projectId: self._id}).fetch();
            var stations = Items.find({projectId: self._id}).fetch();
            var subwayLegend = d3.select('#subway-legend');

            var legend = subwayLegend
                .attr('transform', 'translate(80,500)')
            ;
            // d3 enter
            legend.selectAll('rect')
                .data(subwayLines)
                .enter()
                .append('rect')
                .attr('y', function(line, index) {
                    return index * 20;
                })
                .attr("width", 10)
                .attr("height", 10)
                .style('fill', function(line) {
                    return line.options.subway.color;
                })
            ;
            legend.selectAll('text')
                .data(subwayLines)
                .enter()
                .append("text")
                .attr("x", 20)
                .attr("y", function(line, index){
                    return index *  20 + 9;
                })
                .text(function(line) {
                    return line.name;
                });
            ;
        });
    }
};
