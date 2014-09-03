Meteor.getD3Selection = function(document, string, data) {
    var selection = document.selectAll(string)
        .data(data, function(objectData) {
            return objectData.getId();
        });

    return selection;
}
