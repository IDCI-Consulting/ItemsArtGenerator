Projects = new Meteor.Collection('projects');

/*Meteor.methods({
    project: function(projectAttributes) {
        var project = _.extend(_.pick(projectAttributes, 'name', 'description', 'visibility', 'tags', 'publicationState'), {
            createdAt: new Date().getTime()
        });

        var projectId = Projects.insert(project);

        return projectId;
    }
});*/
