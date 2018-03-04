const http = require('http');
const parser = require('./parser.js');

const modelBase = '/opt/deepspeech/';

parser.start({
    model: modelBase + 'output_graph.pb',
    alphabet: modelBase + 'alphabet.txt',
    lm: modelBase + 'lm.binary',
    trie: modelBase + 'trie'
});

function endRequest(status, response, data){
    response.writeHead(status,{"Content-Type":"text\plain"});
    response.end(data);
}

var server = http.createServer ( function(request,response){
    if(request.method == "POST")
    {
        let body = [];
        request.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body);
            parser.parse(body, function(result){
                console.log('ending request');
                endRequest(200, response, result);
            });
        });
    }
    else
    {
        endRequest(500, response, "Undefined request .");
    }
});

server.listen(80);
console.log("Server running on port 80");

//anohter option
//https://stackoverflow.com/questions/46972607/node-js-receive-file-in-http-request