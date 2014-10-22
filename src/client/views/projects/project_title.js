Template.title.title = function() {
    var self = this;
    if(! self.handle) {
        self.handle = Deps.autorun(function() {
            var categories = ItemCategories.find({projectId: self._id}).fetch();
            var n = 100 / (categories.length - 1);
            var subwayTitle = d3.select('#subway-title');
            var gradient = d3.select('defs')
                .append('linearGradient')
                .attr('id', 'title-gradient')
                .attr('x1', '0%')
                .attr('y1', '0%')
                .attr('x2', '100%')
                .attr('y2', '100%')
                .attr('spreadMethod', 'pad')
            ;
            for (var i = 0, l = categories.length; i < l; i++) {
                gradient
                    .append('stop')
                    .attr('offset', n * i + '%')
                    .attr('stop-color', categories[i].options.subway.color)
                    .attr('stop-opacity', 1)
                ;
            }
            subwayTitle
                .append('text')
                .data([self])
                .attr('x', 700)
                .attr('y', 50)
                .attr('text-anchor', 'middle')
                .style('font-size', '50px')
                .text(self.name);
            ;
        });
    }
}
