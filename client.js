"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Fs = require("fs");
var ArgumentParser = require("argparse");
var parser = require("./parser");
var argParser = new ArgumentParser({ addHelp: true });
argParser.addArgument(['model'], { help: 'Path to the model (protocol buffer binary file)' });
argParser.addArgument(['alphabet'], { help: 'Path to the configuration file specifying the alphabet used by the network' });
argParser.addArgument(['lm'], { help: 'Path to the language model binary file', nargs: '?' });
argParser.addArgument(['trie'], { help: 'Path to the language model trie file created with native_client/generate_trie', nargs: '?' });
argParser.addArgument(['audio'], { help: 'Path to the audio file to run (WAV format)' });
var args = argParser.parseArgs();
console.log('model ' + args['model']);
console.log('alphabet ' + args['alphabet']);
console.log('lm ' + args['lm']);
console.log('trie ' + args['trie']);
console.log('audio ' + args['audio']);
parser.start(args);
var buffer = Fs.readFileSync(args['audio']);
parser.parse(buffer);
