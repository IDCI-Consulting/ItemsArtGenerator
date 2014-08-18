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
