Projects = new Meteor.Collection('projects');

Projects.allow({
    insert: function(userId, doc) {
        return userId && userId === doc.authors[0];
    },
    update: function (userId, doc, fields, modifier) {
        // can only change your own documents
        return _.contains(doc.authors, userId);
    },
    remove: function (userId, doc) {
        // can only remove your own documents
        return _.contains(doc.authors, userId);
    }
});

Projects.deny({
    update: function (userId, docs, fields, modifier) {
        return _.contains(fields, 'isModel');
    },
    remove: function (userId, doc) {
        return doc.isModel;
    }
});
