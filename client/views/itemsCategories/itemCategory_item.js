Template.itemCategoryItem.helpers({
    items: function() {

        return Items.find({projectId: this.projectId, itemsCategories: { 
            $in: [
                this._id
            ]
        }});
    }
});
