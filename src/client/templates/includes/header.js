Template.header.helpers({
    isAuthor: function() {
        return _.contains(this.authors, Meteor.userId());
    }
});
