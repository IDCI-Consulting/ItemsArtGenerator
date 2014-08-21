Meteor.bindFormData = function(object, formData) {
    for(var i = 0, len = formData.length; i < len; i++) {
        var pattern = /(\S+)\[\]$/;
        if(pattern.test(formData[i].name)) {
            var field = pattern.exec(formData[i].name);
            object[field[1]].push(formData[i].value);
        } else {
            object[formData[i].name] = formData[i].value;
        }
    }

    return object;
};
