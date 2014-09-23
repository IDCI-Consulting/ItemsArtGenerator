Meteor.bindFormData = function(object, formData) {
    for(var i = 0, len = formData.length; i < len; i++) {
        var patternCategory = /(\S+)\[\]$/;
        var patternOptions = /.+[.]/;

        // Check if form name finished by '[]'
        if(patternCategory.test(formData[i].name)) {
            var field = patternCategory.exec(formData[i].name);
            object[field[1]].push(formData[i].value);
        // Check if form name have any dot
        } else if(patternOptions.test(formData[i].name)) {
            // Take everything except dot
            var pattern = /([\w]+)/g;
            // Put in array every words between dot
            var fields = formData[i].name.match(pattern);
            Meteor.buildOption(object, fields, formData[i].value);
        } else {
            object[formData[i].name] = formData[i].value;
        }
    }

    return object;
};
