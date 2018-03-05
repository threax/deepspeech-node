"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var threads_1 = require("threads");
var ResponseManager_1 = require("./ResponseManager");
var pool = new threads_1.Pool(1);
pool.run('./worker.js').send({}); //Warms up deep speech, but still allows web server to start quickly.
var responses = new ResponseManager_1.ResponseManager();
pool
    .on('done', function (job, message) {
    var args = job.sendArgs[0];
    var response = responses.getResponse(args.name);
    endRequest(200, response, JSON.stringify(message));
})
    .on('error', function (job, error) {
    console.error('Job errored:', error);
    var args = job.sendArgs[0];
    var response = responses.getResponse(args.name);
    var message = 'Internal Server Error: ';
    if (error.message) {
        message += error.message;
    }
    else {
        message += 'Unknown Error';
    }
    console.error(message, error);
    endRequest(500, response, message);
})
    .on('finished', function () {
    //never stop
    //pool.killAll();
});
function endRequest(status, response, data) {
    if (response) {
        response.writeHead(status, { "Content-Type": "application\json" });
        response.end(data);
    }
}
var server = http.createServer(function (request, response) {
    if (request.method == "POST") {
        var body_1 = [];
        request.on('data', function (chunk) {
            body_1.push(chunk);
        }).on('end', function () {
            var args = {
                body: Buffer.concat(body_1),
                name: responses.addResponse(response)
            };
            pool.send(args);
        }).on('error', function (err) {
            endRequest(500, response, err.name + ': ' + err.message);
        });
    }
    else {
        endRequest(500, response, "Not Supported.");
    }
});
server.listen(80);
console.log("Server running on port 80");
