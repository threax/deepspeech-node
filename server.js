var http = require('http');
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
        body = Buffer.concat(body).toString();
            console.log(body);
        });


        response.end("received POST request.");
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