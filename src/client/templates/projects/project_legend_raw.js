Template.projectLegendRaw.rendered = function()  {
    Meteor.setTimeout(function() {
        $('#subway-legend').append('<div id="done"></div>');
    }, 1500);
    Meteor.setLegendRowsHeights(21);
};