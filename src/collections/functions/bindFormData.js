Meteor.bindFormData = function(object, formData) {
    for(var i = 0, len = formData.length; i < len; i++) {
        var patternCategory = /(\S+)\[\]$/;
        var patternOptions = /.+[.]/;

        if(patternCategory.test(formData[i].name)) {
            var field = patternCategory.exec(formData[i].name);
            object[field[1]].push(formData[i].value);
        } else if(patternOptions.test(formData[i].name)) {
            var pattern = /([\w]+)/g;
            var fields = formData[i].name.match(pattern);
            Meteor.buildOption(object, fields, formData[i].value);
        } else {
            object[formData[i].name] = formData[i].value;
        }
    }

    return object;
};
