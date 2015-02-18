ItemCategories = new Mongo.Collection('itemCategories');

ItemCategories.find({}).observe({
    changed: function(newDocument, oldDocument) {
      var project = Projects.findOne(newDocument.projectId);
      if (project && project.state === "published") {
        Meteor.unpublishedActions(project._id);
      }
    },
    removed: function(oldDocument) {
        var items = Items.find({categories: {$in: [oldDocument._id]}}).fetch();

      	var project = Projects.findOne(oldDocument.projectId);
      	if (project && project.state === "published") {
      	  Meteor.unpublishedActions(project._id);
      	}
        // Remove the deleted category for each item
        _.each(items, function(item) {
            var index = item.categories.indexOf(oldDocument._id);

            if (index !== -1) {
                item.categories.splice(index, 1);
            }

            if (item.categories.length === 0) {
                Items.remove(item._id);
            }
            var item = Items.findOne(item._id);
            if (item) {
                Items.update(item._id, {$set: {categories: item.categories}});
            }
        });
    }
});

Meteor.methods({
    removeUnconsistentItem: function (subwayLineId, item, position) {
        var itemPosition = {};
        itemPosition["items." + position] = "";
        ItemCategories.update(subwayLineId, {$unset: itemPosition});
    }
});

ItemCategories.allow({
    insert: function(userId, doc) {
        if (Meteor.checkIfUserIsAdmin(userId)) {
            return true;
        }
        var project = Projects.findOne(doc.projectId);
        return _.contains(project.authors, userId);
    },
    update: function (userId, doc, fields, modifier) {
        if (Meteor.checkIfUserIsAdmin(userId)) {
            return true;
        }
        var project = Projects.findOne(doc.projectId);
        return _.contains(project.authors, userId);
    },
    remove: function (userId, doc) {
        if (Meteor.checkIfUserIsAdmin(userId)) {
            return true;
        }
        var project = Projects.findOne(doc.projectId);
        return _.contains(project.authors, userId);
    }
});
