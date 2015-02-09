/**
 * Calculate the max height a legend line should be, then set that height
 * There are 7 legends lines per row. For each row the maximum height has to be calculate.
 */
Template.projectShow.rendered = function()  {
    var lines = jQuery("#subway-legend > ul.inline-list > li"),
        max = 0,
        cpt = 0,
        loop = 0
    ;
    _.each(lines, function(elt) {
        var stopsLength = $(elt).find('ul > li').length;
        cpt++;
        max = max < stopsLength ? stopsLength : max;
        if (cpt === 7) {
            jQuery("#subway-legend > ul.inline-list > li > ul")
                .slice(loop*7, loop*7+7)
                .css('height', 19*max+'px')
            ;
            max = cpt = 0;
        }
    });
};