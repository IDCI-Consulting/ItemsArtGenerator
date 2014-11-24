/*
 * Check if is an author
 *
 * @param userId: The user's id
 *
 * @return true or false
 */

Meteor.isAuthor = function(userId) {
    var user = Meteor.users.findOne(userId);
    if (user) {
        return true;
    }

    return false;
};
