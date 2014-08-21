Package.describe({
    summary: "Subway ressource handler"
});

Package.on_use(function (api, where) {
    api.use('underscore', 'client');

    api.add_files('lib/subwayLine.js', 'client');
    api.add_files('lib/subwayStation.js', 'client');

    api.export('SubwayLine', 'client');
    api.export('SubwayStation', 'client');

});

Package.on_test(function (api) {
    api.use('mys-subway');

    //api.add_files('mys-subway_tests.js', 'client');
});
