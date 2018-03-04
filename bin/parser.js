"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Ds = require("deepspeech");
var Wav = require("node-wav");
// These constants control the beam search decoder
// Beam width used in the CTC decoder when building candidate transcriptions
var BEAM_WIDTH = 500;
// The alpha hyperparameter of the CTC decoder. Language Model weight
var LM_WEIGHT = 1.75;
// The beta hyperparameter of the CTC decoder. Word insertion weight (penalty)
var WORD_COUNT_WEIGHT = 1.00;
// Valid word insertion weight. This is used to lessen the word insertion penalty
// when the inserted word is part of the vocabulary
var VALID_WORD_COUNT_WEIGHT = 1.00;
// These constants are tied to the shape of the graph used (changing them changes
// the geometry of the first layer), so make sure you use the same constants that
// were used during training
// Number of MFCC features to use
var N_FEATURES = 26;
// Size of the context window used for producing timesteps in the input vector
var N_CONTEXT = 9;
function totalTime(hrtimeValue) {
    return (hrtimeValue[0] + hrtimeValue[1] / 1000000000).toPrecision(4);
}
var model;
function start(args) {
    console.error('Loading model from file %s', args['model']);
    var model_load_start = process.hrtime();
    model = new Ds.Model(args['model'], N_FEATURES, N_CONTEXT, args['alphabet'], BEAM_WIDTH);
    var model_load_end = process.hrtime(model_load_start);
    console.error('Loaded model in %ds.', totalTime(model_load_end));
    if (args['lm'] && args['trie']) {
        console.error('Loading language model from files %s %s', args['lm'], args['trie']);
        var lm_load_start = process.hrtime();
        model.enableDecoderWithLM(args['alphabet'], args['lm'], args['trie'], LM_WEIGHT, WORD_COUNT_WEIGHT, VALID_WORD_COUNT_WEIGHT);
        var lm_load_end = process.hrtime(lm_load_start);
        console.error('Loaded language model in %ds.', totalTime(lm_load_end));
    }
}
exports.start = start;
function parse(buffer, callback) {
    var wavDecode = Wav.decode(buffer);
    if (wavDecode.sampleRate != 16000) {
        throw 'Error: sample rate (' + wavDecode.sampleRate + ') is not 16kHz. Input files must be 16kHz to work.';
    }
    var audioBuffer = buffer;
    var inference_start = process.hrtime();
    console.log('Starting inference.');
    var audioLength = (audioBuffer.length / 2) * (1 / 16000);
    // We take half of the buffer_size because buffer is a char* while
    // LocalDsSTT() expected a short*
    var result = model.stt(audioBuffer.slice(0, audioBuffer.length / 2), 16000);
    console.log(result);
    var inference_stop = process.hrtime(inference_start);
    console.log('Inference took %ds for %ds audio file.', totalTime(inference_stop), audioLength.toPrecision(4));
    if (callback) {
        callback(result);
    }
}
exports.parse = parse;
