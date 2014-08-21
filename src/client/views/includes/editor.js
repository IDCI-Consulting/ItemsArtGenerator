Template.editor.events({
    'click .createItemCategory': function(e, template) {
        e.preventDefault();

        var instance = UI.renderWithData(Template.itemCategoryCreate, {'projectId': template.data._id});
        Meteor.loadModal(instance);
    },

    'click .createItem': function(e, template) {
        e.preventDefault();

        var instance = UI.renderWithData(Template.itemCreate, {'projectId': template.data._id});
        Meteor.loadModal(instance);
    }
})
