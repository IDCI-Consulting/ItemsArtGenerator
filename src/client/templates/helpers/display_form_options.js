UI.registerHelper('displayFormOptions', function(context, type) {
    var project = Projects.findOne({_id: context.projectId}),
        projectType = project.type,
        configuration = JSON.parse(ItemArt.configuration),
        formConfiguration = configuration.options[project.type][type],
        string = '';
    ;

    _.each(formConfiguration, function(value, key) {
        string += '<label>' + value['label'] + '</label>' + ' <' + value['tag'] + ' type="' + value['type'] + '" name="options.' + project.type + '.' + key + '"';
        if(context.options !== undefined) {
            string += 'value ="' + context.options[project.type][key] + '">';
        } else {
            string += '>';
        }
    });

    return new Handlebars.SafeString(string);
});