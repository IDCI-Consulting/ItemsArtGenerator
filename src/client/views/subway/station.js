var ObserveStation;

Template.station.rendered = function() {
    var subwayStation = this.data;
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

    // Items collection observer
    ObserveStation = Items.find({_id: subwayStation._id}).observe({
        added: function(document) {
            if(d3.select('#station-' + document._id).empty()) {
                var gContainer = outputSubway
                    .append('g')
                    .datum(document)
                    .attr('id', function(subwayStation) {
                        return 'station-' + subwayStation._id;
                    })
                    .attr('class', 'subway-station')
                    .attr('transform', function(subwayStation) {
                        return 'translate(' + [document.options.subway.cx,document.options.subway.cy] + ')';
                    })
                    .call(dragStation)
                ;
                gContainer
                    .append('circle')
                    .attr('r', function(subwayStation) {
                        return 10 + (subwayStation.categories.length - 1) * 4;
                    })
                ;
                gContainer
                    .append('text')
                    .text(subwayStation.name)
                    .attr('x', 10)
                ;
            }
        },

        changed: function(newDocument, oldDocument) {
            outputSubway
                .select('#station-' + newDocument._id)
                .datum(newDocument)
            ;

            console.log(d3.select('#station-' + newDocument._id).attr('id'));
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
