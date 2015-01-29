Parameters = {
    'api_public_endpoint': 'http://localhost:3000',
    'allowed_parameters': [
        {
            'multiple': true,
            'name': 'tags',
            'elements': [
                'anniversaire',
                'mariage',
                'evg-evj',
                'pot-de-depart',
                'television',
                'musique',
                'cinema',
                'sports',
                'culture',
                'actualite',
                'alimentation',
                'travail'
            ]
        },
        {
            'multiple': false,
            'name': 'visibility',
            'elements': [
                'private',
                'public'
            ]
        },
        {
            'multiple': false,
            'name': 'state',
            'elements': [
                'published',
                'blocked',
                'new'
            ]
        }
    ]
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
