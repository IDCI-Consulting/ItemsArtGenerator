/*
 * Display a Modal
 *
 * @param templateInstance: The template's instance which want to load in the modal
 */

Meteor.loadModal = function(templateInstance) {
    $('#modalEditor').foundation('reveal', 'open');
    var form = $('#modalEditor > .content').find('form').get(0);

    // Clear the modal content on close
    $(document).on('closed.fndtn.reveal', function () {
        $('#modalEditor > .content').empty();
    });
};
