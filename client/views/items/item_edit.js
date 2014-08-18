Template.itemEdit.helpers({
    allCategories: function() {
        return ItemCategories.find();
    },

    itemHasCategory: function(categories, categoryId) {
        return _.contains(categories, categoryId);
    }
});


Template.itemEdit.events({
    'submit form': function(e, template) {
        e.preventDefault();

        var formData = $(e.target).serializeArray(),
            item = {
                categories: [],
            };

        var result = Meteor.bindFormData(item, formData);
        Items.update(this._id, {$set: result});
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
