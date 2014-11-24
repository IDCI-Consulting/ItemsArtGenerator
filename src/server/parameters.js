Parameters = {
    'api_public_endpoint': 'http://192.168.0.30:3000'
};


Accounts.registerLoginHandler(function(loginRequest) {
    var user = Meteor.users.findOne(loginRequest.userId);
    if(!user) {
        return 'notFound';
    }
    //creating the token and adding to the user
    var stampedToken = Accounts._generateStampedLoginToken();
    //hashing is something added with Meteor 0.7.x,
    //you don't need to do hashing in previous versions
    var hashStampedToken = Accounts._hashStampedToken(stampedToken);

    Meteor.users.update(user._id,
        {$push: {'services.resume.loginTokens': hashStampedToken}}
    );

    //sending token along with the userId
    return {
        userId: user._id,
        token: stampedToken.token
    }
});
