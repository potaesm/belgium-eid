let Reader = require('./js_src/reader');
let reader = new Reader();
reader.on('card-inserted', (card) => {
    console.log('CARD INSERTED', card);
});

reader.on('card-removed', () => {
    console.log('CARD REMOVED');
});