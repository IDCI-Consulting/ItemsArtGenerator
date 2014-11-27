var ObserveLine;

Template.line.rendered = function() {
    var subwayLine = this.data;
    var gLines = d3.select('#subway-lines');
    var gLegend = d3.select('#subway-legend > ul');

    /*****************************/
    /****** Get path coords ******/
    /*****************************/
    var lineFunction = d3.svg.line()
        .x(function(subwayStation) {
            return subwayStation.options.subway.cx;
        })
        .y(function(subwayStation) {
            return subwayStation.options.subway.cy;
        })
        .interpolate("linear")
    ;

    /****************************/
    /*** Drag the line's name ***/
    /****************************/
    var dragFirstLineName = d3.behavior.drag()
        .on('drag', function(subwayLine) {
            subwayLine.options.subway.cx1 = (d3.event.x).toFixed();
            subwayLine.options.subway.cy1 = (d3.event.y).toFixed();

            d3.select(this).attr("transform", "translate(" + d3.event.x + "," + d3.event.y + ")");
        })
        .on('dragend', function(subwayLine) {
            ItemCategories.update(subwayLine._id, {$set: {'options.subway.cx1': subwayLine.options.subway.cx1, 'options.subway.cy1': subwayLine.options.subway.cy1}})
        })
    ;

    var dragLastLineName = d3.behavior.drag()
        .on('drag', function(subwayLine) {
            subwayLine.options.subway.cx2 = (d3.event.x).toFixed();
            subwayLine.options.subway.cy2 = (d3.event.y).toFixed();

            d3.select(this).attr("transform", "translate(" + d3.event.x + "," + d3.event.y + ")");
        })
        .on('dragend', function(subwayLine) {
            ItemCategories.update(subwayLine._id, {$set: {'options.subway.cx2': subwayLine.options.subway.cx2, 'options.subway.cy2': subwayLine.options.subway.cy2}})
        })
    ;

    /*****************************************/
    /*** Draw line with new station coords ***/
    /*****************************************/
    var draw = function(subwayLine) {
        var stations = [];
        var line = ItemCategories.findOne({_id: subwayLine._id});
        var items = Items.find({categories: {$in: [line._id]}}).fetch();

        // Add the new stations coords in stations array belonging to this subwayLine
        if (line) {
            _.each(line.items, function(itemId, key) {
                _.each(items, function(value, key) {
                    if(itemId === value._id) {
                        stations.push(value);
                    }
                });
            });
        }
        gLines
            .selectAll('#line-' + line._id)
            .transition()
            .duration(500)
            .attr('d', function(line) {
                return lineFunction(stations);
            })
            .style('stroke', function(line) {
                return line.options.subway.color;
            })
        ;
        gLines
            .selectAll('#first-line-node-' + line._id)
            .transition()
            .duration(500)
            .attr('transform', 'translate(' + [line.options.subway.cx1,line.options.subway.cy1] + ')')
        ;
        gLines
            .selectAll('#first-line-color-' + line._id)
            .transition()
            .duration(500)
            .attr('fill', line.options.subway.color)
        ;
        gLines
            .selectAll('#first-line-name-' + line._id)
            .transition()
            .duration(500)
            .text(line.name)
        ;
        gLines
            .selectAll('#last-line-node-' + line._id)
            .transition()
            .duration(500)
            .attr('transform', 'translate(' + [line.options.subway.cx2,line.options.subway.cy2] + ')')
        ;
        gLines
            .selectAll('#last-line-color-' + line._id)
            .transition()
            .duration(500)
            .attr('fill', line.options.subway.color)
        ;
        gLines
            .selectAll('#last-line-name-' + line._id)
            .transition()
            .duration(500)
            .text(line.name)
        ;
        gLegend
            .selectAll('#legend-' + line._id + ' > span')
            .transition()
            .duration(0)
            .style('background', line.options.subway.color)
        ;
        gLegend
            .selectAll('#legend-' + line._id + ' > span > p')
            .text(function(line) {
                return line.name;
            })
        ;
    }


    // ItemCategories collection observer
    ObserveLine = ItemCategories.find({_id: subwayLine._id}).observe({
        added: function(document) {
            var firstStation = 50;
            var lastStation = 50
            if (document.items) {
                var lastStationPosition = _.size(document.items);
                firstStation = Items.findOne(document.items[1]);
                lastStation = Items.findOne(document.items[lastStationPosition]);
            }

            gLines
                .append('path')
                .datum(document)
                .attr('id', "line-" + document._id)
                .attr('class', 'subway-line')
                .style('stroke', document.options.subway.color)
            ;

            var gFirst = gLines
                .append('g')
                .datum(document)
                .attr('id', 'first-line-node-' + document._id)
                .attr('class', 'subway-line')
                .attr('transform', 'translate(' + [document.options.subway.cx1,document.options.subway.cy1] + ')')
                .call(dragFirstLineName)
            ;
            gFirst
                .append('rect')
                .attr('id', 'first-line-color-' + document._id)
                .attr('width', document.name.length + 150)
                .attr('height', 30)
                .attr('fill', document.options.subway.color)
            ;

            gFirst
                .append('text')
                .attr('id', 'first-line-name-' + document._id)
                .attr('x', 60)
                .attr("y", 20)
                .attr('fill', '#fff')
                .style("text-anchor", "middle")
                .style("stroke-width", 1)
                .style("font-size","18px")
                .text(document.name)
            ;

            var gLast = gLines
                .append('g')
                .datum(document)
                .attr('id', 'last-line-node-' + document._id)
                .attr('class', 'subway-line')
                .attr('transform', 'translate(' + [document.options.subway.cx2,document.options.subway.cy2] + ')')
                .call(dragLastLineName)
            ;
            gLast
                .append('rect')
                .attr('id', 'last-line-color-' + document._id)
                .attr('width', document.name.length + 150)
                .attr('height', 30)
                .attr('fill', document.options.subway.color)
            ;

            gLast
                .append('text')
                .attr('id', 'last-line-name-' + document._id)
                .attr('x', 60)
                .attr("y", 20)
                .attr('fill', '#fff')
                .style("text-anchor", "middle")
                .style("stroke-width", 1)
                .style("font-size","18px")
                .text(document.name)
            ;

            gLegend
                .attr('class', 'inline-list')
                .append('li')
                .datum(document)
                .attr('id', 'legend-line-' + document._id)
                .append('span')
                .style('background', document.options.subway.color)
                .append('p')
                .text(document.name)
            ;
            gLegend
                .select('#legend-line-' + document._id)
                .append('ul')
                .attr('id', 'stations-' + document._id)
                .style('font-size', "7px")
            ;
        },

        changed: function(newDocument, oldDocument) {
            gLines
                .select('#line-' + newDocument._id)
                .datum(newDocument)
            ;
            gLines
                .select('#first-line-node-' + newDocument._id)
                .datum(newDocument)
            ;
            gLines
                .select('#last-line-node-' + newDocument._id)
                .datum(newDocument)
            ;
            gLegend
                .select('#legend-' + newDocument._id)
                .datum(newDocument)
            ;
            draw(newDocument);
        },

        removed: function(oldDocument) {
            gLines
                .select('#line-' + oldDocument._id)
                .remove()
            ;
            gLines
                .select('#first-line-name-' + oldDocument._id)
                .remove()
            ;
            gLines
                .select('#last-line-name-' + oldDocument._id)
                .remove()
            ;
            gLegend
                .select('#legend-' + oldDocument._id)
                .remove()
            ;
            draw(oldDocument);
        }
    });

    // Items collection observer
    ObserveStation = Items.find({categories: {$in: [subwayLine._id]}}).observe({
        added: function(document) {
            gLegend
                .select('#stations-' + subwayLine._id)
                .datum(document)
                .append('li')
                .attr('id', 'legend-station-' + document._id)
                .style('color', subwayLine.options.subway.color)
                .text(document.name)
            ;
            draw(subwayLine);
        },
        changed: function(newDocument, oldDocument) {
            gLegend
                .select('#legend-station-' + newDocument._id)
                .datum(newDocument)
            ;
            draw(subwayLine);
        },
        removed: function(oldDocument) {
            gLegend
                .select('#legend-station-' + oldDocument._id)
                .remove()
            ;
            draw(subwayLine);
        }
    });
};

// Stop observing station and line when the template is destroyed
Template.line.destroyed = function(){
    if(ObserveStation && ObserveLine) {
        ObserveLine.stop();
        ObserveStation.stop();
    }
};
