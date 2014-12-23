/*
 * Check if the userId belong to an admin
 * @param: userId
 *
 * @return: true or false
 */

Meteor.checkIfUserIsAdmin = function (userId) {
    var user = Meteor.users.findOne(userId);
    return user.profile.isAdmin
};
