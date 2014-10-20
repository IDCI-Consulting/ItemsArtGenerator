Template.projectRaw.helpers({
    lines: function() {
        return ItemCategories.find({projectId: this._id});
    }
});

Template.projectRaw.title = function() {
    var self = this;
    if(! self.handle) {
        self.handle = Deps.autorun(function() {
            console.log(self);
            var subwayTitle = d3.select('#subway-title');
            subwayTitle
                .append("text")
                .data([self])
                .attr("x", (1000 / 2))
                .attr("y", 50)
                .attr("text-anchor", "middle")
                .style("font-size", "50px")
                .text(self.description);
            ;
        });
    }
};
