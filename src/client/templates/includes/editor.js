Template.editor.rendered = function() {
    var initialPosition, finalPosition;
    this.$(".stations").sortable({
        start: function(e, ui) {
            initialPosition = ui.item.index() + 1;
        },
        stop: function(e, ui) {
            element = ui.item.get(0);
            finalPosition = ui.item.index() + 1;
            var categoryId = Blaze.getData(element).categories[0];
            var category = ItemCategories.findOne(categoryId);

            Meteor.changeItemPosition(category, initialPosition, finalPosition);
            ItemCategories.update(category._id, {$set: {items: category.items}});
        }
    });
};

Template.editor.events({
    'click .create-item-category': function(e, template) {
        e.preventDefault();

        var instance = Blaze.renderWithData(Template.itemCategoryCreate, {'projectId': template.data._id}, $('#modalEditor > .content').get(0));
        Meteor.loadModal(instance);
    },
    'click .create-item': function(e, template) {
        e.preventDefault();

        var instance = Blaze.renderWithData(Template.itemCreate, {'projectId': template.data._id}, $('#modalEditor > .content').get(0));
        Meteor.loadModal(instance);
    },

    "click .zoom-out": function(e) {
        e.preventDefault();

        Meteor.call('changeStationsRadius', this._id, 5, function(err, data) {
            if (err) {
                console.log(err);
            }
        });
    },
    "click .zoom-in": function(e) {
        e.preventDefault();

        Meteor.call('changeStationsRadius', this._id, 8, function(err, data) {
            if (err) {
                console.log(err);
            }
        });
    }
});
