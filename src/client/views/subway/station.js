var ObserveStation;

Template.station.rendered = function() {
    var subwayStation = this.data;
    var id = "station-" + subwayStation._id;
    var selectorId = '#station-' + id;
    var outputSubway = d3.select('#subway-svg');

    // Drag Functions
    var dragStation = d3.behavior.drag()
        .on('dragstart', function(subwayStation) {
            Items.update(subwayStation._id, {$set: {options: {subway: {cx: subwayStation.options.subway.cx, cy: subwayStation.options.subway.cy, dragged: true}}}});
        })
        .on('drag', function(subwayStation) {
            d3.select(this).attr("transform", "translate(" + d3.event.x + "," + d3.event.y + ")");
        })
        .on('dragend', function(subwayStation) {
            Items.update(subwayStation._id, {$set: {options: {subway: {cx: d3.event.sourceEvent.layerX, cy: d3.event.sourceEvent.layerY, dragged: false}}}});
        })
    ;

    // Draw station
    var draw = function(subwayStation) {
        outputSubway
        .selectAll('#station-' + subwayStation._id)
        .transition()
        .duration(500)
        .attr('class', function(subwayStation) {
            var c = 'subway-station';
            if(subwayStation.options.subway.dragged) {
                c += ' dragged';
            }
            return c;
        })
            .attr('transform', 'translate(' + [subwayStation.options.subway.cx,subwayStation.options.subway.cy] + ')')
        ;
    };

    // Select
    station = outputSubway.selectAll(selectorId);
    stationData = station.data([subwayStation]);

    // Enter
    gContainer = stationData
        .enter()
        .append('g')
        .attr('id', id)
        .attr('class', 'subway-station')
        .attr('transform', 'translate(' + [subwayStation.options.subway.cx,subwayStation.options.subway.cy] + ')')
        .call(dragStation)
    ;
    gContainer
        .append('circle')
        .attr('r', 10)
    ;
    gContainer
        .append('text')
        .text(subwayStation.name)
        .attr('x', 10)
    ;

    // Items collection observer
    ObserveStation = Items.find({_id: subwayStation._id}).observe({
        changed: function(newDocument, oldDocument) {
            outputSubway
                .select('#station-' + newDocument._id)
                .datum(newDocument)
            ;
            draw(newDocument);
        },
        removed: function(oldDocument) {
            outputSubway
                .select('#station-' + oldDocument._id)
                .remove()
            ;
            draw(oldDocument);
        }
    });
};

// Stop observing station when the template is destroyed
Template.station.destroyed = function(){
    if(ObserveStation) {
        ObserveStation.stop();
    }
};
