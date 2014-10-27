if(!Modernizr.inputtypes.color) {
    Modernizr.load({
        test: Modernizr.inputtypes.color,
        yep : '',
        nope: '/public/scripts/spectrum.js'
    });
}
