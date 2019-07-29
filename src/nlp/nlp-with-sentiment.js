const { log } = console
const Sentiment = require('sentiment')

const sentiment = new Sentiment()
const docx = sentiment.analyze('I like apples')
log(docx)
const mydocx = [
    'I love apples',
    'I don\'t eat epper',
    'the movie was very nice',
    'this book is the best',
    // 'I like apples',
    // 'I like apples',
]

mydocx.forEach(s => log(sentiment.analyze(s)))
