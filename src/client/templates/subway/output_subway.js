Template.outputSubway.rendered = function() {

    Meteor.setTimeout(function() {
        $('#project-raw').append('<div id="done"></div>');
    }, 1500);

    // Display the editor on double click
    $(document).on("dblclick", function() {
        $('.off-canvas-wrap').foundation('offcanvas', 'show', 'move-left');
    });

    /*fontsize = function () {
        if ($("#subway-legend > ul > li > ul > li").height() >= 300) {
            var fontSize = $("#subway-legend > ul > li > ul > li").width() * 100 / $("#subway-legend > ul > li > ul > li").height(); // 10% of container width
            $("#subway-legend > ul > li > ul > li").css('font-size', fontSize + "px");
        }
    };
    $(window).resize(fontsize);
    $(document).ready(fontsize);*/
};
