UI.registerHelper('eachIndex', function () {
    var withIndex = this.map(function(x, i) {
        return {data: x, index: i}
    });
    return UI.Each(function() {
        return withIndex;
    }, UI.block(null), UI.block(null));
});
