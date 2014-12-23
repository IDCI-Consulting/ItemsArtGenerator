Template.subwayMap.helpers({
    lines: function() {
        return ItemCategories.find({projectId: this._id});
    }
});

Template.subwayMap.rendered = function() {
    Meteor.setTimeout(function() {
        $('#svg').append('<div id="done"></div>');
    }, 1500);

    var self = this.data;
    Tracker.autorun(function() {
        var contributors = d3.select('svg');
        contributors
            .append('text')
            .text(function() {
                var phrase = "";
                if (self.contributors) {
                    return phrase += "Contributors :"  + self.contributors;
                }

                return phrase;
            })
            .attr('x', '20px')
            .attr('y', "960px")
            .attr('fill', '#5e5e5e')
        ;
    });
};