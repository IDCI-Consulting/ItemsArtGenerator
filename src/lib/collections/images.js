//Set Cache Control headers so we don't overload our meteor server with http requests
FS.HTTP.setHeadersForGet([
    ['Cache-Control', 'public, max-age=31536000']
    ]);

//Create the master store
var masterStore = new FS.Store.GridFS("master");

//Create a thumbnail store
var thumbnailStore = new FS.Store.GridFS("thumbnail", {
    //Create the thumbnail as we save to the store.
    transformWrite: function(fileObj, readStream, writeStream) {
        /*
         * Use graphicsmagick to create a 1170x1170 (size of SVG) square thumbnail at 100% quality,
         * orient according to EXIF data if necessary and then save by piping to the
         * provided writeStream
         */
        gm(readStream, fileObj.name).resize(1170,1755,"^")
        .quality(100).autoOrient().stream().pipe(writeStream);
    }
});

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
    insert: function(userId, file) {
        return true;
    },
    update: function(userId, file, fields, modifier) {
        return true;
    },
    remove: function(userId, file) {
        return true;
    },
    download: function() {
        return true;
    }
});
