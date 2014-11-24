/*
 * Display a Modal
 *
 * @param templateInstance: The template's instance which want to load in the modal
 */

Meteor.loadModal = function(templateInstance) {
    $('#modalEditor > .content').empty();
    UI.insert(templateInstance, $('#modalEditor > .content').get(0));
    $('#modalEditor').foundation('reveal', 'open');
    var form = $('#modalEditor > .content').find('form').get(0);
    if (form) {
        $(form).on('submit', function(e) {
            $('#modalEditor').foundation('reveal', 'close');
        });
    }
};
