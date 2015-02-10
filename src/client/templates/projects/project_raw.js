Template.projectRaw.helpers({
    url: function() {
        if (this.background) {
            var fileObj = Images.findOne(this.background);
            return 'url(' + fileObj.url() + ')';
        }

        return 'rgb(255,250,230)';
    }
});

Template.projectRaw.rendered = function()  {
    Meteor.setLegendRowsHeights(19);
};