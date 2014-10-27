Template.projectTitle.title = function() {
    d3.select('#subway-title')
        .append('text')
        .attr('x', 700)
        .attr('y', 50)
        .attr('text-anchor', 'middle')
        .style('font-size', '50px')
        .text(this.name);
    ;
}
