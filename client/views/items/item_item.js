Template.itemItem.events({
    'click .delete': function(e, template) {
        e.preventDefault();

        var currentProjectId = template.data.projectId;

        if(confirm("Delete this itemCategory ?")) {
            var currentItemId = this._id;
            Items.remove(currentItemId);
            Router.go('projectShow', {_id: currentProjectId});
        }
    }

})
