Template.itemEdit.helpers({
    allCategories: function() {
        return ItemCategories.find({projectId: this.projectId}, {sort: { name: 1 }});
    },
    itemHasCategory: function(categories, categoryId) {
        return _.contains(categories, categoryId);
    },
    isAdmin: function() {
        var user = Meteor.users.findOne(Meteor.userId());
        return user.profile.isAdmin;
    }
});


Template.itemEdit.events({
    'submit form': function(e, template) {
        e.preventDefault();

        var formData = $(e.target).serializeArray(),
            item = {
                categories: []
            };
        var boundData = Meteor.bindFormData(item, formData);
        //Hack for station's radius
        boundData.options.subway.r = this.options.subway.r;
        if (boundData.categories.length === 0) {
            $("p.error").replaceWith('<p class="error">You must choose a category</p>');
        } else {
            Items.update(this._id, {$set: boundData});
            $('#modalEditor').foundation('reveal', 'close');
        }
    }
});
