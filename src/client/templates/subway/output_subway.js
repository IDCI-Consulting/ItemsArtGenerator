Template.outputSubway.rendered = function() {

    Meteor.setTimeout(function() {
        $('#project-raw').append('<div id="done"></div>');
    }, 1500);

    // Display the editor on double click
    $(document).on("dblclick", function() {
        $('.off-canvas-wrap').foundation('offcanvas', 'show', 'move-left');
    });
};
