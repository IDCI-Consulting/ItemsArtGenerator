Meteor.autoLogin = function(userId, callback) {
  //create a login request with admin: true, so our loginHandler can handle this request
    loginRequest = {userId: userId};
    //send the login request
    Accounts.callLoginMethod({
        methodArguments: [loginRequest],
        userCallback: callback
    });
};
