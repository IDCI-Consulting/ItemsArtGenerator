Template.itemEdit.helpers({
    allCategories: function() {
        return ItemsCategories.find();
    },

    itemHasCategory: function(itemCategories, categoryId) {
        return _.contains(itemCategories, categoryId);
    }
});


Template.itemEdit.events({
    'submit form': function(e, template) {
        e.preventDefault();

        var currentItemId = template.data._id;
        var currentProjectId = template.data.projectId;

        var itemProperties = {
            name: $(e.target).find('[name=itemName]').val(),
            description: $(e.target).find('[name=itemDescription]').val()
        }

        Items.update(currentItemId, {$set: itemProperties}, function(error) {
            Router.go('projectShow', {_id: currentProjectId});
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
