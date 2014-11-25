Template.output.helpers({
    url: function() {
        if (this.background) {
            return Images.findOne(this.background).url();
        }

        return '';
    }
});
