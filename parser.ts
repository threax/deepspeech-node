import * as Wav from 'node-wav';
import { IParseResult } from './ISendArgs';
import * as fs from 'fs';

var Ds: any;

try{
    Ds = require('deepspeech-gpu');
    console.log('Found GPU version of deepspeech.');
}
catch(gpuEx){
    console.log('GPU version of deepspeech not found, using cpu version.');
    try{
        Ds = require('deepspeech');
    }
    catch(cpuEx){
        throw 'Exceptions loading any deepspeech library:\nGpu: ' + gpuEx + '\nCpu: ' + cpuEx;
    }
}

// These constants control the beam search decoder

// Beam width used in the CTC decoder when building candidate transcriptions
const BEAM_WIDTH = 500;

// The alpha hyperparameter of the CTC decoder. Language Model weight
const LM_WEIGHT = 1.75;

// The beta hyperparameter of the CTC decoder. Word insertion weight (penalty)
const WORD_COUNT_WEIGHT = 1.00;

// Valid word insertion weight. This is used to lessen the word insertion penalty
// when the inserted word is part of the vocabulary
const VALID_WORD_COUNT_WEIGHT = 1.00;


// These constants are tied to the shape of the graph used (changing them changes
// the geometry of the first layer), so make sure you use the same constants that
// were used during training

// Number of MFCC features to use
const N_FEATURES = 26;

// Size of the context window used for producing timesteps in the input vector
const N_CONTEXT = 9;

function totalTime(hrtimeValue: any) {
  return (hrtimeValue[0] + hrtimeValue[1] / 1000000000).toPrecision(4);
}

export interface IStartArgs{
    model: string;
    alphabet: string;
    lm: string;
    trie: string;
}

var model: any;

export function start(args: IStartArgs){
    console.log('Loading model from file %s', args['model']);
    
    if(!fs.existsSync(args.model)){
        throw new Error('Cannot find ' + args.model);
    }

    if(!fs.existsSync(args.alphabet)){
        throw new Error('Cannot find ' + args.alphabet);
    }

    const model_load_start = process.hrtime();
    model = new Ds.Model(args['model'], N_FEATURES, N_CONTEXT, args['alphabet'], BEAM_WIDTH);
    const model_load_end = process.hrtime(model_load_start);
    
    console.error('Loaded model in %ds.', totalTime(model_load_end));

    if (args['lm'] && args['trie']) {
        console.log('Loading language model from files %s %s', args['lm'], args['trie']);

        if(!fs.existsSync(args.lm)){
            throw new Error('Cannot find ' + args.lm);
        }

        if(!fs.existsSync(args.trie)){
            throw new Error('Cannot find ' + args.trie);
        }
        
        const lm_load_start = process.hrtime();
        model.enableDecoderWithLM(args['alphabet'], args['lm'], args['trie'], LM_WEIGHT, WORD_COUNT_WEIGHT, VALID_WORD_COUNT_WEIGHT);
        const lm_load_end = process.hrtime(lm_load_start);
        
        console.error('Loaded language model in %ds.', totalTime(lm_load_end));
    }
}

export function parse(buffer: Buffer): IParseResult {
    const wavDecode = Wav.decode(buffer);

    if (wavDecode.sampleRate != 16000) {
        throw 'Error: sample rate (' + wavDecode.sampleRate + ') is not 16kHz. Input files must be 16kHz to work.';
    }

    const inference_start = process.hrtime();
    const audioLength = (buffer.length / 2) * (1 / 16000);

    // We take half of the buffer_size because buffer is a char* while
    // LocalDsSTT() expected a short*
    var result = model.stt(buffer.slice(0, buffer.length / 2), 16000);
    const inference_stop = process.hrtime(inference_start);

    return {
        result: result,
        inferenceTime: totalTime(inference_stop),
        audioLength: audioLength
    };
}