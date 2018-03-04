"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var threads_1 = require("threads");
var uuidv1 = require("uuid/v1");
var pool = new threads_1.Pool(1);
pool.run('./worker.js').send({}); //Warms up deep speech, but still allows web server to start quickly.
var ResponseManager = (function () {
    function ResponseManager() {
        this.responses = {};
    }
    ResponseManager.prototype.addResponse = function (response) {
        var name = uuidv1();
        while (this.responses[name] !== undefined) {
            name = uuidv1();
        }
        this.responses[name] = response;
        return name;
    };
    ResponseManager.prototype.getResponse = function (name) {
        var response = this.responses[name];
        if (response) {
            delete this.responses[name];
        }
        return response;
    };
    return ResponseManager;
}());
var responses = new ResponseManager();
pool
    .on('done', function (job, message) {
    var args = job.sendArgs[0];
    var response = responses.getResponse(args.name);
    endRequest(200, response, message);
})
    .on('error', function (job, error) {
    console.error('Job errored:', error);
    var args = job.sendArgs[0];
    var response = responses.getResponse(args.name);
    endRequest(500, response, 'Internal Server Error');
})
    .on('finished', function () {
    //never stop
    //pool.killAll();
});
function endRequest(status, response, data) {
    if (response) {
        response.writeHead(status, { "Content-Type": "text\plain" });
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
        });
    }
    else {
        endRequest(500, response, "Undefined request .");
    }
});
server.listen(80);
console.log("Server running on port 80");