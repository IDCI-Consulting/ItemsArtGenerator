Template.station.rendered = function() {
    var subwayStation = this.data;
    var selectorId = '#' + subwayStation.getId();

    // Drag Functions
    var dragStation = d3.behavior.drag()
        .on('dragstart', function(subwayStation) {
            subwayStation.setBeingChangedOn();
            subwayStation.persist();
        })
        .on('drag', function(subwayStation) {
            d3.select(this).attr("transform", "translate(" + d3.event.x + "," + d3.event.y + ")");
        })
        .on('dragend', function(subwayStation) {
            subwayStation.setX(d3.event.sourceEvent.layerX);
            subwayStation.setY(d3.event.sourceEvent.layerY);
            subwayStation.setBeingChangedOff();
            subwayStation.persist();
        })
    ;

    // Select
    station = d3.select('#subway-svg').selectAll(selectorId);
    stationData = station.data([subwayStation]);

    // Enter
    gContainer = stationData
        .enter()
        .append('g')
        .attr('id', subwayStation.getId())
        .attr('class', 'subway-station')
        .attr('transform', 'translate(' + [subwayStation.getX(),subwayStation.getY()] + ')')
        .call(dragStation)
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


    Items.find().observe({
        changed: function(newDocument, oldDocument) {
            if(newDocument._id === subwayStation.getId()) {
                subwayStation.setOptions(newDocument.options.subway);
                Template.station.draw(subwayStation);
            }
        },
        removed: function(id) {
            var selectorId = '#' + id;

            var removingStation = d3.select('#subway-svg').selectAll(selectorId);
            removingStation.remove();
        }
    });
};

Template.station.draw = function(subwayStation) {
    station = d3.select('#subway-svg').selectAll('#' + subwayStation.getId())
        .transition()
        .duration(500)
        .attr('class', function(subwayStation) {
            var c = 'subway-station';
            if(subwayStation.isBeingChanged()) {
                c += ' dragged';
            }
            return c;
        })
        .attr('transform', 'translate(' + [subwayStation.getX(),subwayStation.getY()] + ')')
    ;
};
