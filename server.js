const http = require('http');
const parser = require('./parser.js');

const modelBase = '/opt/deepspeech/';

parser.start({
    model: modelBase + 'output_graph.pb',
    alphabet: modelBase + 'alphabet.txt',
    lm: modelBase + 'lm.binary',
    trie: modelBase + 'trie'
});

var server = http.createServer ( function(request,response){
    console.log(request.method);
    response.writeHead(200,{"Content-Type":"text\plain"});
    if(request.method == "GET")
    {
        response.end("received GET request.")
    }
    else if(request.method == "POST")
    {
        let body = [];
        request.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body);
            var result = parser.parse(body);
            response.end(result);
        });
    }
    else
    {
        response.end("Undefined request .");
    }
});

server.listen(80);
console.log("Server running on port 80");

//anohter option
//https://stackoverflow.com/questions/46972607/node-js-receive-file-in-http-request