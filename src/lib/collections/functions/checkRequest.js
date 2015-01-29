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

    var getUsefulParams = function(query) {
        var allowedParams = Parameters.allowed_parameters;
        for (var i = 0; i < allowedParams.length; i++) {
            if (!query.hasOwnProperty(allowedParams[i]['name'])) {
                allowedParams.splice(i, 1);
            }
        }

        return allowedParams;
    }

    // throw a 400 if some query parameters are not allowed
    var query = action.request.query;
    var usefulParams = getUsefulParams(query);
    for (var i = 0; i < usefulParams.length; i++) {
        var paramName = usefulParams[i]['name'];
        var elements = usefulParams[i]['elements'];
        var multipleBool = usefulParams[i]['multiple'];
        if (query.hasOwnProperty(paramName)) {
            if (multipleBool) {
                for (var j = 0; j < query[paramName].length; j++) {
                    if (elements.indexOf(query[paramName][j]) === -1) {
                        action.response.writeHead(400, {'Content-Type': 'text/html'});
                        action.response.end("The value '"+query[paramName][j]+"' of the parameter '"+paramName+"' is not allowed");
                    }
                }
            } else {
                if (elements.indexOf(query[paramName]) === -1) {
                    action.response.writeHead(400, {'Content-Type': 'text/html'});
                    action.response.end("The value '"+query[paramName]+"' of the parameter '"+paramName+"' is not allowed");
                }
            }
        }

    }

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
