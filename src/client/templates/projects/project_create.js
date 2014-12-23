Template.projectCreate.helpers({
    models: function() {
        return Projects.find({isModel: true});
    },
    isAdmin: function() {
        var user = Meteor.users.findOne(Meteor.userId());
        return user.profile.isAdmin;
    }
});

Template.projectCreate.events({
    'submit form': function(e) {
        e.preventDefault();

        var project = {};
        var formData = $(e.target).serializeArray();
        var modelId = $(e.target).find('[name=model]').val();

        if (modelId !== "") {
            var model = Projects.findOne(modelId);
            project = Meteor.cloneProject(model);
        } else {
            project = {
                _id: new Meteor.Collection.ObjectID()._str,
                createdAt: new Date().getTime(),
                authors: [Meteor.userId()],
                type: "subway",
                state: "new",
                votes: 0,
                sales: 0
            };
            Projects.insert(project);
        }

        project.state = "new";
        var boundData = Meteor.bindFormData(project, formData);
        console.log(boundData);
        Projects.update(
            boundData._id,
            {
                $set: {
                    name: boundData.name,
                    description: boundData.description,
                    visibility: boundData.visibility,
                    tags: boundData.tags,
                    state: boundData.state,
                    contributors: boundData.contributors
                }
            }
        );
        $('#modalEditor').foundation('reveal', 'close');
    }
});
