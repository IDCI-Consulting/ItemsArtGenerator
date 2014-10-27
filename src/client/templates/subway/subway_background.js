Template.subwayBackground.background = function() {
    var self = this;
    Deps.autorun(function () {
        d3.selectAll('defs')
            .append('pattern')
            .attr('id', 'bg')
            .attr('patternUnits', 'userSpaceOnUse')
            .attr('width', '1600')
            .attr('height', '1000')
            .append('image')
            .attr('xlink:href', '/uploads/backgrounds/' + self.background + '')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', '1600')
            .attr('height', '1000')
        ;
        d3.select('.subway-background')
            .append('rect')
            .attr('width', '1600')
            .attr('height', '1000')
            .attr('fill', 'url(#bg)')
        ;
    });
};

Template.subwayBackground.destroyed = function () {
  this.handle && this.handle.stop();
};
