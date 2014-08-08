Template.itemEdit.helpers({
    allCategories: function() {
        return ItemCategories.find();
    },

    itemHasCategory: function(itemCategories, categoryId) {
        return _.contains(itemCategories, categoryId);
    }
});


Template.itemEdit.events({
    'submit form': function(e, template) {
        e.preventDefault();

        var currentItemId = template.data._id,
            currentProjectId = template.data.projectId,
            formData = $(e.target).serializeArray(),
            itemProperties = {};

        for(var i = 0, length = formData.length; i < length; i++) {
            itemProperties[formData[i].name] = formData[i].value;
        }
        console.log(itemProperties);
        /*Items.update(currentItemId, {$set: itemProperties}, function(error) {
            Router.go('projectShow', {_id: currentProjectId});
        });*/
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
