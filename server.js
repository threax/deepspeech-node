var http = require('http');
var parser = require('./parser.js');
var Pool = require('threads').Pool;
var uuidv1 = require('uuid/v1');
var pool = new Pool(1);
pool.run('./worker.js').send({}); //Warms up deep speech, but still allows web server to start quickly.
var responses = {};
function getResponse(index) {
    var response = responses[index];
    if (response) {
        delete responses[index];
    }
    return response;
}
pool
    .on('done', function (job, message) {
    var response = getResponse(job.sendArgs[0].responseName);
    if (response) {
        endRequest(200, response, message);
    }
})
    .on('error', function (job, error) {
    console.error('Job errored:', error);
    var response = getResponse(job.sendArgs[0].responseName);
    if (response) {
        endRequest(500, response, 'Internal Server Error');
    }
})
    .on('finished', function () {
    //console.log('Everything done, shutting down the thread pool.');
    //pool.killAll();
});
function endRequest(status, response, data) {
    response.writeHead(status, { "Content-Type": "text\plain" });
    response.end(data);
}
var server = http.createServer(function (request, response) {
    if (request.method == "POST") {
        var body_1 = [];
        request.on('data', function (chunk) {
            body_1.push(chunk);
        }).on('end', function () {
            var responseName = uuidv1(); //This is still 1 thread, so this should be unique enough
            responses[responseName] = response;
            pool.send({
                body: Buffer.concat(body_1),
                responseName: responseName
            });
        });
    }
    else {
        endRequest(500, response, "Undefined request .");
    }
});
server.listen(80);
console.log("Server running on port 80");
//anohter option
//https://stackoverflow.com/questions/46972607/node-js-receive-file-in-http-request 
