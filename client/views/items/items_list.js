Template.itemsList.helpers({
    items: function() {
        return Items.find();
    }
});

Template.itemsList.events({
    "click .delete" : function(e) {
        e.preventDefault();

        if(confirm("Delete this item ?")) {
            var currentItemId = this._id;
            Items.remove(currentItemId);
        }
    }
})
