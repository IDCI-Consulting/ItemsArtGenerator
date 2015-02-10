/**
 * Calculate the max height a legend line should be, then set that height
 * There are 7 legends lines per row. For each row the maximum height has to be calculate.
 */
Meteor.setLegendRowsHeights = function(lineHeight) {
    var lines = jQuery("#subway-legend > ul.inline-list > li"),
        max = 0,
        cpt = 0,
        loop = 0
    ;
    _.each(lines, function(elt, index) {
        cpt++;
        var stopsLength = $(elt).find('ul > li').length;
        var pHeight = $(elt).find('span > p').height();
        var currentHeight = pHeight + (lineHeight * stopsLength) + 25;
        max = max < currentHeight ? currentHeight : max;
        console.log("index = "+index);
        console.log("stop = "+stopsLength);
        console.log("pheight = "+pHeight);
        if (cpt === 7) {
            jQuery("#subway-legend > ul.inline-list > li")
                .slice(loop*7, loop*7+7)
                .css('height', max+'px')
            ;
            loop++;
            max = cpt = 0;
        }
    });
};