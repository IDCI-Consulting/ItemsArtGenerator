Template.projectCreate.events({
    'submit form': function(e) {
        e.preventDefault();

        var project = {
            name: $(e.target).find('[name=name]').val(),
            description: $(e.target).find('[name=description]').val()
        }

        Meteor.call('project', project, function(error, id) {
            if (error) {
                throwError(error.reason);
            } else {
                Router.go('projectShow', {_id: id});
            }
        });
    }
});
