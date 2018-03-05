"use strict";
var parser = require("./parser");
var modelBase = '/opt/deepspeech/';
var startupError = null;
try {
    parser.start({
        model: modelBase + 'output_graph.pb',
        alphabet: modelBase + 'alphabet.txt',
        lm: modelBase + 'lm.binary',
        trie: modelBase + 'trie'
    });
}
catch (err) {
    startupError = err;
}
module.exports = function (input, done) {
    if (startupError !== null) {
        throw startupError;
    }
    var body = input.body;
    if (body) {
        var buffer = Buffer.from(body.data);
        done(parser.parse(buffer));
    }
    else {
        done(null);
    }
};
