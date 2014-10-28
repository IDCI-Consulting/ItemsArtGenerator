Template.projectCreate.helpers({
    models: function() {
        return Projects.find({isModel: true});
    }
});

Template.projectCreate.events({
    'submit form': function(e) {
        e.preventDefault();

        var formData = $(e.target).serializeArray();
        var modelId = $(e.target).find('[name=model]').val();

        if (modelId !== "") {
            var model = Projects.findOne(modelId);
            var project = Meteor.cloneProject(model);
        } else {
            var project = {
                _id: new Meteor.Collection.ObjectID()._str,
                createdAt: new Date().getTime(),
<<<<<<< HEAD
                votes: 0,
                sales: 0
=======
                authors: []
>>>>>>> master
            };
            project.authors.push(Meteor.connection.userId());
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
