const Spotty = require('./app.js');
console.log(Spotty.Artist);
const spot = new Spotty({
    client_id: '4e84620bf33f4ffe96da0dbf2ebdc8f0',
    client_secret: '74ff5aecc63a47119cdfac5c5eecaf5d',
    redirect_uri: ''
});

spot.auth().then(() => {
    spot.search('tyler the creator','artist').then((results) => {
      results.getSongs().then(songs => {
        console.log(songs.items);
      }).catch(console.error);
    }).catch(console.error);
}).catch(console.error);
