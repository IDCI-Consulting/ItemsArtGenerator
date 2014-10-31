Template.projectCreate.helpers({
    models: function() {
        return Projects.find({isModel: true});
    }
});

Template.projectCreate.events({
    'submit form': function(e, template) {
        e.preventDefault();

        var formData = $(e.target).serializeArray();
        var modelId = $(e.target).find('[name=model]').val();
        var authorId = $(e.target).find('[name=author]').val();

        if (modelId !== "") {
            var model = Projects.findOne(modelId);
            var project = Meteor.cloneProject(model, authorId);
        } else {
            var project = {
                _id: new Meteor.Collection.ObjectID()._str,
                createdAt: new Date().getTime(),
                authors: [],
                votes: 0,
                sales: 0
            };
            project.authors.push(authorId);
            Projects.insert(project);
        }

        var boundData = Meteor.bindFormData(project, formData);
        Projects.update(
            boundData._id,
            {
                $set: {
                    name: boundData.name,
                    description: boundData.description,
                    visibility: boundData.visibility,
                    type: boundData.type,
                    tags: boundData.tags,
                    state: boundData.state
                }
            }
        );
    }
});
