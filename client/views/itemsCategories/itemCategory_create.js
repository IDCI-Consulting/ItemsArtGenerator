Template.itemCategoryCreate.events({
    'submit form': function(e, template) {
        e.preventDefault();

        var itemCategory = {
            name: $(e.target).find('[name=name]').val(),
            description: $(e.target).find('[name=description]').val(),
            projectId: template.data,
            createdAt: new Date().getTime()
        };

        Meteor.call('itemCategory', itemCategory, function(error) {
            if (error) {
                throwError(error.reason);
            } else {
                Router.go('projectShow', {_id: template.data});
            }
        });
    }
});
