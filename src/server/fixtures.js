// Fixture data

if (Projects.find().count() === 0) {
    // insert data in projects collection if there's no data

    // Insert lines
    var lineAId = ItemCategories.insert({
        name: "Ligne A",
        description: "De Perrache à Vaulx-en-Velin La Soie",
        options: {
            subway: {
                color : "#FF0000"
            }
        },
        projectId : projectId
    });

    var lineBId = ItemCategories.insert({
        name: 'Ligne B',
        description: 'De Gare d\'Oullins à Charpennes',
        options: {
            subway: {
                color : "#0000FF"
c        projectId : projectId
    });

    // Insert Stations of A line
    Items.insert({
        name: "Perrache",
        description: "Arrêt de la ligne A",
        options: {
            subway: {
                cx: 79,
                cy: 267,
                r: 10
            }
        },
        projectId: projectId,
        categories: [lineAId]
    });

    Items.insert({
        name: "Ampère",
        description: "Arrêt de la ligne A",
        options: {
            subway: {
                cx: 84,
                cy: 185,
                r: 10
            }
        },
        projectId: projectId,
        categories: [lineAId]
    });

    Items.insert({
        name: "Bellecour",
        description: "Arrêt de la ligne A",
        options: {
            subway: {
                cx: 93,
                cy: 136,
                r: 10
            }
        },
        projectId: projectId,
        categories: [lineAId]
    });

    Items.insert({
        name: "Cordeliers",
        description: "Arrêt de la ligne A",
        options: {
            subway: {
                cx: 114,
                cy: 89,
                r: 10
            }
        },
        projectId: projectId,
        categories: [lineAId]
    });

    Items.insert({
        name: "Hotel de Ville",
        description: "Arrêt de la ligne A",
        options: {
            subway: {
                cx: 153,
                cy: 45,
                r: 10
            }
        },
        projectId: projectId,
        categories: [lineAId]
    });

    Items.insert({
        name: "Foch",
        description: "Arrêt de la ligne A",
        options: {
            subway: {
                cx: 232,
                cy: 59,
                r: 10
            }
        },
        projectId: projectId,
        categories: [lineAId]
    });

    Items.insert({
        name: "Masséna",
        description: "Arrêt de la ligne A",
        options: {
            subway: {
                cx: 307,
                cy: 68,
                r: 10
            }
        },
        projectId: projectId,
        categories: [lineAId]
    });

    Items.insert({
        name: "Charpennes",
        description: "Arrêt de la ligne A",
        options: {
            subway: {
                cx: 317,
                cy: 136,
                r: 10
            }
        },
        projectId: projectId,
        categories: [lineAId, lineBId]
    });

    Items.insert({
        name: "République",
        description: "Arrêt de la ligne A",
        options: {
            subway: {
                cx: 368,
                cy: 88,
                r: 10
            }
        },
        projectId: projectId,
        categories: [lineAId]
    });

    Items.insert({
        name: "Gratte-Ciel",
        description: "Arrêt de la ligne A",
        options: {
            subway: {
                cx: 420,
                cy: 104,
                r: 10
            }
        },
        projectId: projectId,
        categories: [lineAId]
    });

    Items.insert({
        name: "Flachet",
        description: "Arrêt de la ligne A",
        options: {
            subway: {
                cx: 519,
                cy: 126,
                r: 10
            }
        },
        projectId: projectId,
        categories: [lineAId]
    });

    Items.insert({
        name: "Cusset",
        description: "Arrêt de la ligne A",
        options: {
            subway: {
                cx: 550,
                cy: 154,
                r: 10
            }
        },
        projectId: projectId,
        categories: [lineAId]
    });

    Items.insert({
        name: "L.Bonnevay",
        description: "Arrêt de la ligne A",
        options: {
            subway: {
                cx: 581,
                cy: 197,
                r: 10
            }
        },
        projectId: projectId,
        categories: [lineAId]
    });

    Items.insert({
        name: "Vaulx-en-Velin La Soie",
        description: "Arrêt de la ligne A",
        options: {
            subway: {
                cx: 616,
                cy: 270,
                r: 10
            }
        },
        projectId: projectId,
        categories: [lineAId]
    });

    // Insert Stations of B line
    Items.insert({
        name: "Brotteaux",
        description: "Arrêt de la ligne B",
        options: {
            subway: {
                cx: 317,
                cy: 236,
                r: 10
            }
        },
        projectId: projectId,
        categories: [lineBId]
    });
}
