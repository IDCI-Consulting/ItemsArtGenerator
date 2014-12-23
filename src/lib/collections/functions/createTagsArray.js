Meteor.createTagsArray = function(tags) {
    if(!tags) {
        return false;
    }

    tags = tags.replace(/\ */g,'');
    var arrayTags = tags.split(',');

    return arrayTags;
};