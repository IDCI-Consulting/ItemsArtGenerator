/*if(!Modernizr.inputtypes.color) {
    Modernizr.load({
        test: Modernizr.inputtypes.color,
        yep : '',
        nope: '/public/scripts/spectrum.js'
    });
}*/

$(document).on("dblclick", function() {
    $('.off-canvas-wrap').foundation('offcanvas', 'show', 'move-left');
});
