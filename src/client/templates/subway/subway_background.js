Template.subwayBackground.background = function() {
    var self = this;
    Deps.autorun(function () {
        d3.selectAll('defs')
            .append('pattern')
            .attr('id', 'bg')
            .attr('width', '100%')
            .attr('height', '100%')
            .append('image')
            .attr('xlink:href', '/uploads/backgrounds/' + self.background + '')
            .attr('x', '0')
            .attr('width', '100%')
            .attr('height', '100%')
        ;
        d3.select('#subway-lines')
            .append('rect')
            .attr('x', 0)
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('fill', 'url(#bg)')
        ;
    });
};

Template.subwayBackground.destroyed = function () {
  this.handle && this.handle.stop();
};
