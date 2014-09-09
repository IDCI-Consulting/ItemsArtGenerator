Template.station.rendered = function() {
    var subwayStation = this.data;
    var selectorId = '#' + subwayStation.getId();

    station = d3.select('#subway-svg').selectAll(selectorId);
    stationData = station.data([subwayStation]);
    gContainer = stationData
        .enter()
        .append('g')
        .attr('id', subwayStation.getId())
        .attr('class', 'subway-station')
        .attr('transform', 'translate(' + [subwayStation.getX(),subwayStation.getY()] + ')')
    ;
    gContainer
        .append('circle')
        .attr('r', subwayStation.getNodeRadius())
    ;
    gContainer
        .append('text')
        .text(subwayStation.getName())
        .attr('x', 10)
    ;
};

Template.station.draw = function(existingStations, data) {
    existingStations
        .data([data])
        .transition()
        .duration(500)
        .attr('class', function(subwayStation) {
            var c = 'subway-station';
            if(subwayStation.isBeingChanged()) {
                c += ' dragged';
            }
            return c;
        })
        .attr('transform', function(subwayStation) {
            return 'translate(' + [subwayStation.getX(),subwayStation.getY()] + ')';
        })
    ;
};
