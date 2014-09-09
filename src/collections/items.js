Items = new Meteor.Collection('items');


Items.find().observe({
    removed: function(subwayStation) {
        var selectorId = "#" + SubwayStation.getId();

        var removingStation = d3.select("svg").selectAll(selector_id);
        removingStation.remove();

        existingStations = d3.select("svg").selectAll("g");

        Template.station.draw(existingStations, subwayStation);
    }
})

Meteor.methods({
    insertItem: function(itemAttributes) {
        var item = _.extend(_.pick(itemAttributes, 'name', 'description','options', 'categories', 'projectId'));

        Items.insert(item);
    }
});
