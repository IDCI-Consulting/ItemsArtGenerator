Meteor.buildOption = function(object, fields, value) {
    var currentObject = object;
    var currentField = undefined;

    _.each(fields, function(name) {
        currentField = fields.shift();
        if (currentObject[currentField] == undefined) {
            currentObject[currentField] = {};
        }
        currentObject = currentObject[currentField];
    });

    currentObject[fields.shift()] = value;
};
