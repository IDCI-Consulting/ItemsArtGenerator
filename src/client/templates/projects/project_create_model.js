Template.projectCreateModel.events({
    'submit form': function(e) {
        e.preventDefault();

        var file = $('#fileInput').get(0).files[0];
        var formData = $(e.target).serializeArray();
        var project = {
            _id: new Meteor.Collection.ObjectID()._str,
            createdAt: new Date().getTime(),
            type: "subway",
            authors: [Meteor.userId()],
            isModel: true
        };
        if (file) {
            var fileObj = Images.insert(file);
            project.background = fileObj._id;
        }
        var boundData = Meteor.bindFormData(project, formData);
        Projects.insert(boundData);

        $('#modalEditor').foundation('reveal', 'close');
    }
});
