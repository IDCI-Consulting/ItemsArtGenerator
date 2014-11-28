/**
 * Wait until the test condition is true or a timeout occurs. Useful for waiting
 * on a server response or for a ui change (fadeIn, etc.) to occur.
 *
 * @param testFx javascript condition that evaluates to a boolean,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
 * as a callback function.
 * @param onReady what to do when testFx condition is fulfilled,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
 * as a callback function.
 * @param timeOutMillis the max amount of time to wait. If not specified, 3 sec is used.
 */
function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000, //< Default Max Timout is 3s
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                // If not time-out yet and condition not yet fulfilled
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
            } else {
                if(!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    console.log("'waitFor()' timeout");
                    phantom.exit(1);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 250); //< repeat check every 250ms
}

/**
 * Render a project
 *
 * @param url : the web page url to be rendered
 * @param filePath : the path and complete name of the picture to be rendered
 */
function renderProject(url, filePath) {
    var page = require('webpage').create();

    page.viewportSize = {
      width: 1440,
      height: 900
    };
    page.open(url, function (status) {
        // Check for page load success
        if (status !== "success") {
            console.log("Unable to access network");
            return "fail";
        } else {
            // Wait for '#subway-svg' to be visible
            waitFor(function() {
                // Check in the page if a specific element is now visible
                var result = page.evaluate(function() {
                    if (document.getElementById('done')) {
                        return true;
                    }
                    return false;
                });

                return result;

            }, function() {
                console.log("The svg is visible. Rendering the picture...");
                page.render(filePath);
                phantom.exit();
            });
        }
    });
}

var args = require('system').args;
var url = args[1];
var filePath = args[2];

renderProject(url, filePath);








