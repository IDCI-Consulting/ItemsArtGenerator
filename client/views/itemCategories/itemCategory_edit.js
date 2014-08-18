Template.itemCategoryEdit.events({
    'submit form': function(e) {
        e.preventDefault();

        var formData = $(e.target).serializeArray(),
            itemCategory = {};

        var result = Meteor.bindFormData(itemCategory, formData);
        ItemCategories.update(this._id, {$set: result});
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
