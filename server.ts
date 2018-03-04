import * as http from 'http';
import * as parser from './parser';
import { Pool } from 'threads';
import { ISendArgs } from './ISendArgs';
import { ResponseManager } from './ResponseManager';

const pool = new Pool(1);

pool.run('./worker.js').send({}); //Warms up deep speech, but still allows web server to start quickly.

var responses = new ResponseManager();

pool
    .on('done', function (job: any, message: any) {
        var args: ISendArgs = job.sendArgs[0];
        var response = responses.getResponse(args.name);
        endRequest(200, response, JSON.stringify(message));
    })
    .on('error', function (job: any, error: any) {
        console.error('Job errored:', error);
        var args: ISendArgs = job.sendArgs[0];
        var response = responses.getResponse(args.name);
        endRequest(500, response, 'Internal Server Error');
    })
    .on('finished', function () {
        //never stop
        //pool.killAll();
    });

function endRequest(status: number, response: http.ServerResponse, data: string) {
    if(response) {
        response.writeHead(status, { "Content-Type": "application\json" });
        response.end(data);
    }
}

var server = http.createServer(function (request, response) {
    if (request.method == "POST") {
        let body: any[] = [];
        request.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            var args: ISendArgs = {
                body: Buffer.concat(body),
                name: responses.addResponse(response)
            };
            pool.send(args);
        });
    }
    else {
        endRequest(500, response, "Undefined request.");
    }
});

server.listen(80);
console.log("Server running on port 80");