Template.station.rendered = function() {

    var subwayStation = this.data;
    var selectorId = '#' + subwayStation._id;
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

    var draw = function(subwayStation) {
        outputSubway
            .selectAll('#' + subwayStation._id)
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
        .attr('id', subwayStation._id)
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

    Items.find({}).observe({
        changed: function(newDocument, oldDocument) {
            outputSubway
                .select('#' + newDocument._id)
                .datum(newDocument)
            ;
            draw(newDocument);
        },
        removed: function(oldDocument) {
            outputSubway
                .select('#' + oldDocument._id)
                .remove()
            ;
            draw(oldDocument);
        }
    });
};
