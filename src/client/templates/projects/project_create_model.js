Template.projectCreateModel.events({
    'submit form': function(e) {
        e.preventDefault();

        var file = $('#fileInput').get(0).files[0];
        var fileObj = Images.insert(file);
        var formData = $(e.target).serializeArray();
        var project = {
            _id: new Meteor.Collection.ObjectID()._str,
            createdAt: new Date().getTime(),
            background: fileObj._id,
            authors: [],
            isModel: true
        };
        var boundData = Meteor.bindFormData(project, formData);
        console.log(boundData);
        //Projects.insert(boundData);
    }
});
