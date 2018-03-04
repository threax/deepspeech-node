import * as parser from './parser';

const modelBase = '/opt/deepspeech/';

parser.start({
    model: modelBase + 'output_graph.pb',
    alphabet: modelBase + 'alphabet.txt',
    lm: modelBase + 'lm.binary',
    trie: modelBase + 'trie'
});

export = function(input, done) {
    var body = input.body;
    if(body){
        var buffer = Buffer.from(body.data);
        parser.parse(buffer, done);
    }
    else{
        done('No result');
    }
};