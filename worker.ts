import * as parser from './parser';
import { ISendArgs, IParseResult } from './ISendArgs';

const modelBase = '/opt/deepspeech/';
var startupError: any = null;

try {
    parser.start({
        model: modelBase + 'output_graph.pb',
        alphabet: modelBase + 'alphabet.txt',
        lm: modelBase + 'lm.binary',
        trie: modelBase + 'trie'
    });
}
catch(err) {
    startupError = err;
}

export = function(input: ISendArgs, done: (result: IParseResult | null) => void) {
    if(startupError !== null){
        throw startupError;
    }

    var body = input.body;
    if(body){
        var buffer = Buffer.from((<any>body).data);
        done(parser.parse(buffer));
    }
    else{
        done(null);
    }
};