Meteor.getD3Selection = function(document, string, data) {
    var selection = document.selectAll(string)
        .data(data, function(station) {
            return station._id;
        });

    return selection;
}
