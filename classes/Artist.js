const request = require('request');
module.exports = class Artist {
  constructor(raw,token){
    this.name = raw.name;
    this.followers = raw.followers.total;
    this.link = raw.href;
    this.popularity = raw.popularity;
    this.images = raw.images;
    this.uri = raw.uri;
    this.genres = raw.genres;
    this.id = raw.id;
    this.access_token = token;
  }

  getSongs(){
    return new Promise((fulfill,reject) => {
      if(this.access_token === undefined) throw 'Authorization failed';
      var requestOptions = {
        url: `https://api.spotify.com/v1/artists/${this.id}/albums?album_type=album`,
        headers: {
          'Authorization': 'Bearer ' + this.access_token,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        json: true
      };
      request.get(requestOptions,(err,res,body) => {
        if(this.checkSuccessful(err,res)){
          //Got albums
          var albums = body.items;
          var done = 0;
          var tracks = {};
          for(var i = 0; i < albums.length; i++){
            //Start getting tracks
            var reqOptions = {
              url: `https://api.spotify.com/v1/albums/${albums[i].id}/tracks`,
              headers: {
                'Authorization': 'Bearer ' + this.access_token,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              json: true
            };
            request.get(reqOptions,(e,r,b) => {
              if(this.checkSuccessful(e,r)){
                //Got tracks for albums[i]
                var albumTracks = b.items;
                for(var g = 0; g < albumTracks.length; g++){
                  tracks.push(albumTracks[g]);
                }
                done++;
              }
            });
            if(done == albums.length) fulfill(tracks);
          }
        }
      });
    });
  }

  checkSuccessful(err,res){
    return !err && (res.statusCode == 201 || res.statusCode == 200);
  }
}
