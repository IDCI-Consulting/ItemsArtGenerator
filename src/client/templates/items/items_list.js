Template.itemsList.helpers({
    lines: function() {
      var categories = ItemCategories.find({projectId: this._id}, {sort: { name: 1 }}).fetch();
      return categories.sort(function(firstCategory, secondCategory) {
        return Meteor.naturalSort(firstCategory.name, secondCategory.name);
      });
    }
});

Template.itemsList.events({
    "click .delete" : function(e) {
        e.preventDefault();

        if(confirm("Delete this item ?")) {
            Meteor.call('removeItem', this);
        }
    },

    "click .edit-item": function(e) {
        e.preventDefault();

        var instance = Blaze.renderWithData(Template.itemEdit, Items.findOne(this._id), $('#modalEditor > .content').get(0));
        Meteor.loadModal(instance);
    }
})
