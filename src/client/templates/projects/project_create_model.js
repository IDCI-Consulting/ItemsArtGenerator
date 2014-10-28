Template.projectCreateModel.events({
    'submit form': function(e) {
        e.preventDefault();

        var formData = $(e.target).serializeArray();
        var project = {
            _id: new Meteor.Collection.ObjectID()._str,
            createdAt: new Date().getTime(),
            authors: [],
            isModel: true
        };
        project.authors.push(Meteor.connection.userId());

        var boundData = Meteor.bindFormData(project, formData);
        Projects.insert(boundData);
    }
});
