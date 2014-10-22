Projects = new Meteor.Collection('projects');

Projects.find({}).observe({
    removed: function(oldDocument) {
        // Remove items & categories associated
        Items.remove({projectId: oldDocument._id});
        ItemCategories.remove({projectId: oldDocument._id});
    }
});
