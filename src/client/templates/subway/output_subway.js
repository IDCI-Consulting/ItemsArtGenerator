Template.outputSubway.helpers({
    lines: function() {
        return ItemCategories.find({projectId: this._id});
    }
});

Template.outputSubway.rendered = function() {

    Meteor.setTimeout(function() {
        $('#output').append('<div id="done"></div>');
    }, 1500);

    var self = this.data;
    Tracker.autorun(function() {
        var subwayTitle = d3.select('.subway-title');
        subwayTitle
            .append('p')
            .text(self.name)
            .style('color', 'rgb(0,116,173)')
            .style('font-size', '70px')
            .style('text-transform', 'uppercase')
            .style('text-align', 'center')
            .style('padding', '45px')
        ;

        var contributors = d3.select('svg');
        contributors
            .append('text')
            .text(function() {
                var phrase = "Contributors : ";
                if (self.contributors) {
                    return phrase += self.contributors;
                }

                return phrase;
            })
            .attr('x', '20px')
            .attr('y', "960px")
            .attr('fill', '#5e5e5e')
        ;
    });

    // Display the editor on double click
    $(document).on("dblclick", function() {
        $('.off-canvas-wrap').foundation('offcanvas', 'show', 'move-left');
    });
};
