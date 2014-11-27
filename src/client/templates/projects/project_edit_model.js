Template.projectEditModel.events({
    'submit form': function(e) {
        e.preventDefault();

        var file = $('#fileInput').get(0).files[0];
        var formData = $(e.target).serializeArray();
        var project = {
            updatedAt: new Date().getTime(),
        };
        if (file) {
            var fileObj = Images.insert(file);
            project.background = fileObj._id;
        }
        var boundData = Meteor.bindFormData(project, formData);
        Projects.update(this._id, {$set: boundData});

        $('#modalEditor').foundation('reveal', 'close');
    }
});
