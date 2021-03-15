let Reader = require('./dist/reader').default;
let reader = new Reader();
reader.on('card-inserted', (card) => {
    console.log('CARD INSERTED', card);
});

reader.on('card-removed', () => {
    console.log('CARD REMOVED');
});