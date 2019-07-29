const { log } = console
const nlp = require('compromise')
const docx = nlp('This is cool library')

log(docx.data())
log(docx.text())
