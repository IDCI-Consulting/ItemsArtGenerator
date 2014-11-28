/*if(!Modernizr.inputtypes.color) {
    Modernizr.load({
        test: Modernizr.inputtypes.color,
        yep : '',
        nope: '/public/scripts/spectrum.js'
    });
}*/

Meteor.setTimeout(function() {
    $('#output').append('<div id="done"></div>');
}, 1000);
