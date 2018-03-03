#!/usr/bin/env node

const Fs = require('fs');
const ArgumentParser = require('argparse').ArgumentParser;
const parse = require('./parser.js').parse;

var parser = new ArgumentParser({ addHelp: true });
parser.addArgument(['model'], { help: 'Path to the model (protocol buffer binary file)' });
parser.addArgument(['alphabet'], { help: 'Path to the configuration file specifying the alphabet used by the network' });
parser.addArgument(['lm'], { help: 'Path to the language model binary file', nargs: '?' });
parser.addArgument(['trie'], { help: 'Path to the language model trie file created with native_client/generate_trie', nargs: '?' });
parser.addArgument(['audio'], { help: 'Path to the audio file to run (WAV format)' });
var args = parser.parseArgs();

console.log('model ' + args['model']);
console.log('alphabet ' + args['alphabet']);
console.log('lm ' + args['lm']);
console.log('trie ' + args['trie']);
console.log('audio ' + args['audio']);

const buffer = Fs.readFileSync(args['audio']);
parse(buffer, args);