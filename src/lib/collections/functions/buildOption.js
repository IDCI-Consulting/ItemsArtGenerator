Meteor.buildOption = function(object, fields, value) {
    var currentObject = object;
    var currentField = undefined;

    _.each(fields, function(name) {
        // Extract from array the first value & affecting it to currentField
        currentField = fields.shift();
        if (currentObject[currentField] == undefined) {
            currentObject[currentField] = {};
        }
        // Position of currentObject is the nested object
        currentObject = currentObject[currentField];
    });

    currentObject[fields.shift()] = value;
};
