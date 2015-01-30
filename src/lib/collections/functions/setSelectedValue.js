/**
 * Set an option to selected
 *
 * @param selectBox: the select box which want to modify
 * @param attribute : the option's value
 */

Meteor.setSelectedValue = function(selectBox, value) {
    $(selectBox.selector + "> option[value=\"" + value + "\"]").attr("selected", "selected");
};
