Template.itemEdit.helpers({
    allCategories: function() {
        return ItemCategories.find();
    },

    itemHasCategory: function(categories, categoryId) {
        console.log(categories);
        console.log(categoryId);
        return _.contains(categories, categoryId);
    }
});


Template.itemEdit.events({
    'submit form': function(e, template) {
        e.preventDefault();

        var currentItemId = template.data._id,
            currentProjectId = template.data.projectId,
            formData = $(e.target).serializeArray(),
            item = {
                categories: [],
                projectId: currentProjectId
            };

        Meteor.call('bindFormData', item, formData, function(error, result) {
            if (error) {
                throwError(error.reason);
            } else {
                Items.update(currentItemId, {$set: result}, function(error) {
                    Router.go('projectShow', {_id: currentProjectId});
                });
            }
        });
    },

    'click .delete': function(e, template) {
        e.preventDefault();

        var currentProjectId = template.data.projectId;

        if(confirm("Delete this itemCategory ?")) {
            var currentItemId = this._id;
            Items.remove(currentItemId);
            Router.go('projectShow', {_id: currentProjectId});
        }
    }
});
