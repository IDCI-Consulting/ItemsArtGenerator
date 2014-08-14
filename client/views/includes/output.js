Template.output.helpers({
    itemCategories: function() {
        return ItemCategories.find({projectId: this._id});
    }
});

$('a.right-off-canvas-toggle').click(function() {
  $('.inner-wrap').css('min-height', $(window).height() - $('footer').outerHeight() + 'px');
});
