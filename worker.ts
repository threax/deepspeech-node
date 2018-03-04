import * as parser from './parser';
import { ISendArgs } from './ISendArgs';

const modelBase = '/opt/deepspeech/';

parser.start({
    model: modelBase + 'output_graph.pb',
    alphabet: modelBase + 'alphabet.txt',
    lm: modelBase + 'lm.binary',
    trie: modelBase + 'trie'
});

export = function(input: ISendArgs, done: (result: string | null) => void) {
    var body = input.body;
    if(body){
        var buffer = Buffer.from((<any>body).data);
        parser.parse(buffer, done);
    }
    else{
        done(null);
    }
};