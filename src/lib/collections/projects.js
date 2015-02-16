Projects = new Mongo.Collection('projects');

Projects.find({}).observe({
  changed: function(newDocument, oldDocument) {
    if (newDocument.state === "published") {
      Meteor.unpublishedActions(newDocument._id);
    }
  }
});

Projects.allow({
    insert: function(userId, doc) {
        if (Meteor.checkIfUserIsAdmin(userId)) {
            return true;
        }
        return _.contains(doc.authors, userId);
    },
    update: function (userId, doc, fields, modifier) {
        if (Meteor.checkIfUserIsAdmin(userId)) {
            return true;
        }
        return _.contains(doc.authors, userId);
    },
    remove: function (userId, doc) {
        if (Meteor.checkIfUserIsAdmin(userId)) {
            return true;
        }
        return _.contains(doc.authors, userId);
    }
});

Projects.deny({
    update: function(userId, docs, fields, modifier) {
        return _.contains(fields, 'isModel');
    }
});
