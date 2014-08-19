UI.registerHelper('optionable', function(context, options) {
    var fn = options.fn, inverse = options.inverse;
    var ret = "";
    console.log(context);

    if(context && context.length > 0) {
        for(var i=0, j=context.length; i<j; i++) {
            ret = ret + fn(_.extend({}, context[i], { i: i, iPlus1: i + 1 }));
        }
    } else {
        ret = inverse(this);
    }
    return ret;
});
