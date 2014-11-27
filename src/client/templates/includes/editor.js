Template.editor.events({
    'click .create-item-category': function(e, template) {
        e.preventDefault();

        var instance = Blaze.renderWithData(Template.itemCategoryCreate, {'projectId': template.data._id});
        Meteor.loadModal(instance);
    },
    'click .dec': function(e) {
        e.preventDefault();

        var $item = $('.item.selected');
        var category = ItemCategories.findOne(Session.get('selected_itemCategory_id'));
        var initialPosition = $item.index() + 1;
        $item.prev().before($item);
        var finalPosition = $item.index() + 1;

        Meteor.changeItemPosition(category, initialPosition, finalPosition);
        ItemCategories.update(category._id, {$set: {items: category.items}});
    },
    'click .inc': function(e) {
        e.preventDefault();

        var $item = $('.item.selected');
        var category = ItemCategories.findOne(Session.get('selected_itemCategory_id'));
        var initialPosition = $item.index() + 1;
        $item.next().after($item);
        var finalPosition = $item.index() + 1;

        Meteor.changeItemPosition(category, initialPosition, finalPosition);
        ItemCategories.update(category._id, {$set: {items: category.items}});
    },
    'click .create-item': function(e, template) {
        e.preventDefault();

        var instance = Blaze.renderWithData(Template.itemCreate, {'projectId': template.data._id});
        Meteor.loadModal(instance);
    }
})
