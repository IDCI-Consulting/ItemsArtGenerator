// Fixture data

if (Projects.find().count() === 0) {
    // insert data in projects collection if there's no data

    var projectId = Projects.insert({
        name: '120 ans de Jean-Jacques et Claire',
        description: 'Voici notre histoire !',
        createAt: new Date().getTime()
    });


    ItemCategories.insert({
        name: 'Fiesta',
        description: 'Parties in my life',
        createdAt: new Date().getTime(),
        projectId: projectId
    });

    ItemCategories.insert({
        name: 'Life',
        description: 'My life',
        createdAt: new Date().getTime(),
        projectId: projectId
    });


    Items.insert({
        name: "Soirée à Ibiza",
        description: 'Une putain de grosse soirée',
        createAt: new Date().getTime(),
        projectId: projectId
    });

    Items.insert({
        name: "Las Vegas",
        description: 'TROU NOIR',
        createAt: new Date().getTime(),
        projectId: projectId
    });
}
