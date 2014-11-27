Projects = new Mongo.Collection('projects');

Projects.allow({
    insert: function(userId, doc) {
        if(userId === null) {
            return false;
        }
        return _.contains(doc.authors, userId);
    },
    update: function (userId, doc, fields, modifier) {
        return _.contains(doc.authors, userId);
    },
    remove: function (userId, doc) {
        return _.contains(doc.authors, userId);
    }
});

Projects.deny({
    update: function(userId, docs, fields, modifier) {
        return _.contains(fields, 'isModel');
    }
});
