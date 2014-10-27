Template.outputSubway.helpers({
    lines: function() {
        return ItemCategories.find({projectId: this._id});
    }
});

Template.outputSubway.rendered = function() {

    var svg = d3.select('#output')
        .append('svg')
    ;
    var div = d3.select("#output").append("div")
        .attr("class", "tooltip")
        .style("opacity", 1e-6)
    ;
    svg.append('defs');
    svg.append('g')
        .attr('class', 'subway-background');
    svg.append('g')
        .attr('id', 'subway-lines');
    svg.append('g')
        .attr('id', 'subway-stations');
}
