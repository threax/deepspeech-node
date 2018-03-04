import * as http from 'http';
import * as parser from './parser.js';
import { Pool } from 'threads';
import * as uuidv1 from 'uuid/v1';

const pool = new Pool(1);

pool.run('./worker.js').send({}); //Warms up deep speech, but still allows web server to start quickly.

interface ISendArgs {
    body: ArrayBuffer;
    name: string;
}

class ResponseManager {
    private responses: { [key: string]: http.ServerResponse } = {};

    public addResponse(response: http.ServerResponse): string {
        var name = uuidv1();
        while (this.responses[name] !== undefined) {
            name = uuidv1();
        }

        this.responses[name] = response;
        return name;
    }

    public getResponse(name) {
        var response = this.responses[name];
        if (response) {
            delete this.responses[name];
        }
        return response;
    }
}

var responses = new ResponseManager();

pool
    .on('done', function (job, message) {
        var args: ISendArgs = job.sendArgs[0];
        var response = responses.getResponse(args.name);
        endRequest(200, response, message);
    })
    .on('error', function (job, error) {
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
        response.writeHead(status, { "Content-Type": "text\plain" });
        response.end(data);
    }
}

var server = http.createServer(function (request, response) {
    if (request.method == "POST") {
        let body = [];
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
        endRequest(500, response, "Undefined request .");
    }
});

server.listen(80);
console.log("Server running on port 80");