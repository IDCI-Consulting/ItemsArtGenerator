Template.editor.events({
    'click .create-item-category': function(e, template) {
        e.preventDefault();

        var instance = UI.renderWithData(Template.itemCategoryCreate, {'projectId': template.data._id});
        Meteor.loadModal(instance);
    },

    'click .create-item': function(e, template) {
        e.preventDefault();

        var instance = UI.renderWithData(Template.itemCreate, {'projectId': template.data._id});
        Meteor.loadModal(instance);
    }
})
