Template.projectShow.helpers({
    itemCategories: function() {
        return ItemCategories.find({projectId: this._id});
    }
});

Template.projectShow.events({
    "click .addForm": function(e) {
        e.preventDefault();

        $(".categories").prepend('<div class="control-group"><div class="controls"><input name="name" type="text" value="" placeholder="Name"/><textarea name="description" type="text" value="" placeholder="description"></textarea><input type="submit" value="Submit" class="btn btn-success"/></div></div>');
    }
});


