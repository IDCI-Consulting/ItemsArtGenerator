// Fixture data

if (Projects.find().count() === 0) {
    // insert data in projects collection if there's no data
    var myjson = JSON.parse(Assets.getText("data.json"));

    _.each(myjson.projects, function(value, key) {
        Projects.insert(value);
    });

    _.each(myjson.categories, function(value, key) {
        ItemCategories.insert(value);
    });

    _.each(myjson.items, function(value, key) {
        Items.insert(value);
    });
}
