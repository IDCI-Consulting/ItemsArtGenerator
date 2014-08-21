// Fixture data

if (Projects.find().count() === 0) {
    // insert data in projects collection if there's no data

    var projectId = Projects.insert({
        name: 'LYON',
        description: 'Metro de Lyon'
    });


    var ligneAId = ItemCategories.insert({
        name: 'Ligne A',
        description: 'De Perrache à Vaulx-En-Velin La Soie',
        projectId: projectId,
        options: {
            color: "#FF0000"
        }
    });

    var ligneBId = ItemCategories.insert({
        name: 'Ligne B',
        description: 'De Gare d\'Oullins à Charpennes',
        projectId: projectId,
        options: {
            color: "#0000FF"
        }
    });


    Items.insert({
        name: "Perrache",
        description: '',
        projectId: projectId,
        categories: [ligneAId],
        options: {
            coords: {
                x: 2,
                y: 2
            }
        }
    });

    Items.insert({
        name: "Charpennes",
        description: '',
        projectId: projectId,
        categories: [ligneAId, ligneBId],
        options: {
            coords: {
                x: 5,
                y: 5
            }
        }
    });

    Items.insert({
        name: "Vaulx-en-Velin La Soie",
        description: '',
        projectId: projectId,
        categories: [ligneAId],
        options: {
            coords: {
                x: 8,
                y: 9
            }
        }
    });

    Items.insert({
        name: "Part Dieu",
        description: '',
        projectId: projectId,
        categories: [ligneBId],
        options: {
            coords: {
                x: 7,
                y: 4
            }
        }
    });
}
