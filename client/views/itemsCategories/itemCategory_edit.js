Template.itemCategoryEdit.events({
    'submit form': function(e) {
        e.preventDefault();

        var currentItemCategoryId = this._id,
            currentProjectId = this.projectId,
            formData = $(e.target).serializeArray(),
            itemCategoryProperties = {};

        Meteor.call('bindFormData', itemCategoryProperties, formData, function(error, result) {
            if (error) {
                throwError(error.reason);
            } else {
                ItemCategories.update(currentItemCategoryId, {$set: result}, function(error) {
                    Router.go('projectShow', {_id: currentProjectId});
                });
            }
        });
    },

    'click .delete': function(e) {
        e.preventDefault();

        var currentProjectId = this.projectId;

        if(confirm("Delete this itemCategory ?")) {
            var currentItemCategoryId = this._id;
            ItemCategories.remove(currentItemCategoryId);
            Router.go('projectShow', {_id: currentProjectId});
        }
    }
});
