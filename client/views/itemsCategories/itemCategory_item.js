Template.itemCategoryItem.helpers({
    items: function() {
        return Items.find({projectId: this.projectId, itemCategories: { 
            $in: [
                this._id
            ]
        }});
    }
});

Template.itemCategoryItem.events({
    "click .delete": function(e, template) {
        e.preventDefault();

        var currentProjectId = template.data.projectId;

        if(confirm("Delete this item ?")) {
            var currentItemCategoryId = this._id;
            ItemCategories.remove(currentItemCategoryId);
            Router.go('projectShow', {_id: currentProjectId});
        }
    }

});
