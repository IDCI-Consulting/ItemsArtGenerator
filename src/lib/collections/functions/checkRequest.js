/**
 * Check if the request is as expected
 * 
 * @param action: the action being processed, which contains the request
 * @param method : the request method to be checked
 * @param dataArray : an array of data whose elements must be in the request data (for post and put method for example)
 * @param headersDataArray : an array of data whose elements must be in the request headers
 *
 * @return a 405 or a 400 response, or nothing
 */

Meteor.checkRequest = function(action, method, dataArray, headersDataArray) {
    // throw a 405 if project not found
    if (method && action.request.method != method) {
        action.response.writeHead(405, {'Content-Type': 'text/html'});
        action.response.end("Method "+action.request.method+" not allowed");
    }
    // throw a 400 (bad request) if some required parameters are missing
    if (dataArray) {
        var missingParameter = true;
        for (var i = 0; i < dataArray.length; i++) {
            if (method == 'POST' || method == 'PUT') {
                if (!action.request.body[dataArray[i]]) {
                    action.response.writeHead(400, {'Content-Type': 'text/html'});
                    action.response.end("The parameter "+dataArray[i]+" is missing");
                }
            }
        }
    }
    if (headersDataArray) {
        var missingParameter = true;
        for (var i = 0; i < headersDataArray.length; i++) {
            if (!action.request.headers[headersDataArray[i]]) {
                action.response.writeHead(400, {'Content-Type': 'text/html'});
                action.response.end("A parameter is missing");
            }
        }
    }
}
