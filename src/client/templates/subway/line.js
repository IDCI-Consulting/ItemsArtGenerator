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
    var dragLineName = d3.behavior.drag()
        .on('drag', function(subwayLine) {
            subwayLine.options.subway.cx = (d3.event.x).toFixed();
            subwayLine.options.subway.cy = (d3.event.y).toFixed();

            d3.select(this).attr("transform", "translate(" + d3.event.x + "," + d3.event.y + ")");
        })
        .on('dragend', function(subwayLine) {
            ItemCategories.update(subwayLine._id, {$set: {'options.subway.cx': subwayLine.options.subway.cx, 'options.subway.cy': subwayLine.options.subway.cy}})
        })
    ;

    /* Insert stations in the right order
     *
     * @param subwayLine : The subway line which have the stations list
     * @param element: the element where we display them
     */
    var displayStationsInRightOrder = function(subwayLine, element) {
        _.each(subwayLine.items, function(stationId, position) {
            var document = Items.findOne(stationId);
            //In order to purge unconsistent data due to previous fixed bug in editor when removed a station
            if (!document) {
                Meteor.call("removeUnconsistentItem", subwayLine._id, document, position);
            }
            element
                .select('#stations-' + subwayLine._id)
                .datum(document)
                .append('li')
                .text(document.name)
                .attr('id', 'legend-station-' + document._id)
                .style('color', subwayLine.options.subway.color)
                .style('font-size', "12px")
                /*
                    .append('span')
                    .style('color', 'black')
                    .style("font-weight", "normal")
                    .text(": " + document.description)
                */
            ;
        });
    };

    /* Clear the stations list
     *
     * @param subwayLine : The subway line which have the stations list
     * @param element: the element where we clear them
     */
    var clearStationsList = function (subwayLine, element) {
        element
            .select('#stations-' + subwayLine._id)
            .selectAll('li')
            .remove()
        ;
        displayStationsInRightOrder(subwayLine, element);
    };


    /*****************************************/
    /*** Draw line with new station coords ***/
    /*****************************************/
    var draw = function(subwayLine) {
        var stations = [];
        var line = ItemCategories.findOne({_id: subwayLine._id});
        var items = Items.find({categories: {$in: [subwayLine._id]}}).fetch();

        // Add the new stations coords in stations array belonging to this subwayLine
        if (line) {
            _.each(line.items, function(itemId) {
                _.each(items, function(value) {
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
            .attr('d', function() {
                return lineFunction(stations);
            })
            .style('stroke', function(line) {
                return line.options.subway.color;
            })
        ;
        gLines
            .selectAll('#line-node-' + line._id)
            .attr('transform', 'translate(' + [line.options.subway.cx,line.options.subway.cy] + ')')
        ;
        gLines
            .selectAll('#line-color-' + line._id)
            .attr('fill', line.options.subway.color)
        ;
        gLines
            .selectAll('#line-name-' + line._id)
            .text(line.name)
        ;
        gLegend
            .selectAll('#legend-line-' + line._id + ' > span')
            .style('background', line.options.subway.color)
        ;
        gLegend
            .selectAll('#legend-line-' + line._id + ' > span > p')
            .text(line.name)
        ;
        gLegend
            .select('#stations-' + line._id)
            .selectAll('li')
            .style('color', line.options.subway.color)
        ;
    };


    // ItemCategories collection observer
    ObserveLine = ItemCategories.find({_id: subwayLine._id}).observe({
        added: function(document) {

            gLines
                .append('path')
                .datum(document)
                .attr('id', "line-" + document._id)
                .attr('class', 'subway-line')
                .style('stroke', document.options.subway.color)
            ;

            var gLineName = gLines
                .append('g')
                .datum(document)
                .attr('id', 'line-node-' + document._id)
                .attr('class', 'subway-line')
                .attr('transform', 'translate(' + [document.options.subway.cx,document.options.subway.cy] + ')')
                .call(dragLineName)
            ;
            gLineName
                .append('rect')
                .attr('id', 'line-color-' + document._id)
                .attr('width', document.name.length + 150)
                .attr('height', 30)
                .attr('fill', document.options.subway.color)
            ;

            gLineName
                .append('text')
                .attr('id', 'line-name-' + document._id)
                .attr('x', 85)
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
                .style("font-size","15px")
            ;
            gLegend
                .select('#legend-line-' + document._id)
                .append('ul')
                .attr('id', 'stations-' + document._id)
            ;

            displayStationsInRightOrder(document, gLegend);
        },

        changed: function(newDocument, oldDocument) {
            gLines
                .select('#line-' + newDocument._id)
                .datum(newDocument)
            ;
            gLines
                .select('#line-node-' + newDocument._id)
                .datum(newDocument)
            ;
            gLegend
                .select('#legend-line-' + newDocument._id)
                .datum(newDocument)
            ;

            clearStationsList(newDocument, gLegend);
            draw(newDocument);
        },

        removed: function(oldDocument) {
            gLines
                .select('#line-' + oldDocument._id)
                .remove()
            ;
            gLines
                .select('#line-node-' + oldDocument._id)
                .remove()
            ;
            gLegend
                .select('#legend-line-' + oldDocument._id)
                .remove()
            ;
            draw(subwayLine);
        }
    });

    // Items collection observer
    ObserveStation = Items.find({categories: {$in: [subwayLine._id]}}).observe({
        added: function(document) {
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
