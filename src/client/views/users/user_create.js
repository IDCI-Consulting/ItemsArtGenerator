Template.userCreate.events({
    'submit form': function(e) {
        e.preventDefault();

        var formData = $(e.target).serializeArray();
        var user = {
            createdAt: new Date().getTime(),
        };

        var boundData = Meteor.bindFormData(user, formData);
        var userId = Users.insert(boundData);
        Session.set('userToken', boundData.token);
    }
});
