Template.projectTitleRaw.rendered = function() {
    Meteor.setTimeout(function() {
        $('.subway-title').append('<div id="done"></div>');
    }, 1500);
};