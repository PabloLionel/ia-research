const { log } = console
const natural = require('natural')

// tokenizatio
const tokenizer = new natural.WordTokenizer()
const ex1 = 'I like working with java, javascript, C#, Python, Go & C.'
const ex2 = 'NLP-with-JavaScript in Emotion A-I'

log(tokenizer.tokenize(ex1))
log(ex1.split(' '))
const regTokenizer = new natural.RegexpTokenizer({pattern: /\-/})
log(regTokenizer.tokenize(ex2))

const treebanTokenizer = new natural.TreebankWordTokenizer()
log(treebanTokenizer.tokenize(ex1))

// Stemming
// Reduciendo la palabra a su forma base o stems (raiz).
// Normalization

// [running, runner, run, runs]
log(natural.PorterStemmer.stem('running')) // English default
log(natural.PorterStemmerFr.stem('comprendre')) // French
log(natural.PorterStemmerEs.stem('Hablar')) // Spanish

// Attach stem

natural.PorterStemmer.attach()

log('running'.stem())
log('the runner was running to the flowing streams'.tokenizeAndStem())

log(natural.LancasterStemmer.stem('argued'))
