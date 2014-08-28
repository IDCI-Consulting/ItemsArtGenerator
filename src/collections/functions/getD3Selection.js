Meteor.getD3Selection = function(document, string, data) {
    var object = document.selectAll(string)
        .data(data, function(station) {
            return station._id;
        });

    return object;
}
