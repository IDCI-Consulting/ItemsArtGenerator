Meteor.unpublishedActions = function(projectId) {
  if (Meteor.isServer) {
    var path = process.env.PWD+'/.uploads/';
    var exec = Npm.require('child_process').exec;
    exec("rm " + path + projectId + "*", function(error, stdout, stderr) {
      console.log("stdout: " + stdout);
    });
  }
  Projects.update(projectId, {$set: {state: "new"}});
};
