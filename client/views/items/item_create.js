Template.itemCreate.helpers({
    categories: function() {
        return ItemsCategories.find().fetch();
    }
});

Template.itemCreate.events({
    'submit form': function(e, template) {
        e.preventDefault();

        var categories = [];
        $('input[name="itemsCategories[]"]').each(function() {
            if($(this).is(':checked')) {
                categories.push($(this).val());
            }
        });

        var item = {
            name: $(e.target).find('[name=name]').val(),
            description: $(e.target).find('[name=description]').val(),
            projectId: template.data,
            itemsCategories: categories
        };

        Meteor.call('item', item, function(error) {
            if (error) {
                throwError(error.reason);
            } else {
                Router.go('projectShow', {_id: template.data});
            }
        });
    }
});
