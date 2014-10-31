Template.projectCreateModel.events({
    'submit form': function(e) {
        e.preventDefault();

        var formData = $(e.target).serializeArray();
        var authorId = $(e.target).find('[name=author]').val();
        var project = {
            _id: new Meteor.Collection.ObjectID()._str,
            createdAt: new Date().getTime(),
            authors: [],
            isModel: true
        };
        project.authors.push(authorId);

        var boundData = Meteor.bindFormData(project, formData);
        Projects.insert(boundData);
    }
});
