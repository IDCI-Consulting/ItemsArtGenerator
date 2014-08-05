Template.itemCategoryEdit.events({
    'submit form': function(e, template) {
        e.preventDefault();

        var currentItemCategoryId = template.data._id;
        var currentProjectId = template.data.projectId;

        var itemCategoryProperties = {
            name: $(e.target).find('[name=itemCategoryName]').val(),
            description: $(e.target).find('[name=itemCategoryDescription]').val()
        }

        ItemsCategories.update(currentItemCategoryId, {$set: itemCategoryProperties}, function(error) {
            Router.go('projectShow', {_id: currentProjectId});
        });
    },

    'click .delete': function(e, template) {
        e.preventDefault();

        var currentProjectId = template.data.projectId;

        if(confirm("Delete this itemCategory ?")) {
            var currentItemCategoryId = this._id;
            ItemsCategories.remove(currentItemCategoryId);
            Router.go('projectShow', {_id: currentProjectId});
        }
    }
});
