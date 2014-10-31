Template.header.helpers({
    isAuthor: function() {
        var bool;
        _.each(this.authors, function(authorId) {
            if(authorId === UserId) {
                bool = true;
            } else {
                bool = false;
            }
        });
        return bool;
    }
});
