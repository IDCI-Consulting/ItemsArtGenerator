//Set Cache Control headers so we don't overload our meteor server with http requests
FS.HTTP.setHeadersForGet([
    ['Cache-Control', 'public, max-age=31536000']
    ]);

//Create the master store
var masterStore = new FS.Store.GridFS("master");

//Create a thumbnail store
var thumbnailStore = new FS.Store.GridFS("thumbnail");

//Create globally scoped Images collection.
Images = new FS.Collection("images", {
    stores: [thumbnailStore, masterStore],
    filter: {
        maxSize: 10485760, //in bytes
        allow: {
            contentTypes: ['image/*'],
            extensions: ['png', 'jpg', 'jpeg', 'gif']
        },
        onInvalid: function (message) {
            if(Meteor.isClient){
                alert(message);
            }else{
                console.warn(message);
            }
        }
    }
});

Images.allow({
    insert: function(userId, doc) {
        var user = Meteor.users.findOne(userId);
        if(user.isAdmin) {
            return true;
        }
        return false;
    },
    update: function (userId, doc, fields, modifier) {
        return _.contains(doc.authors, userId);
    },
    remove: function (userId, doc) {
        return _.contains(doc.authors, userId);
    }
});
