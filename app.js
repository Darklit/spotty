const request = require('request');
const Artist = require('./classes/Artist.js');

module.exports = class Spotty {
    constructor(info){
        this.id = info.client_id;
        this.redirect = info.redirect_uri;
        this.secret = info.client_secret;
    }

    auth(){
        return new Promise((fulfill,reject)=>{
          var authOptions = {
            url: 'https://accounts.spotify.com/api/token?grant_type=client_credentials',
            headers: {
              'Authorization': 'Basic ' + (new Buffer(this.id + ':' + this.secret).toString('base64')),
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            mode: 'no-cors',
            json: true
          };
            request.post(authOptions,(err,res,body)=>{
                if(!err && res.statusCode == 200){
                    this.access_token = body.access_token;
                    this.token_type = body.token_type;
                    fulfill();
                }else{
                    reject(res.statusCode);
                }
            });
        });
    }

    search(name,type){
      return new Promise((fulfill,reject) => {
        while(name.includes(' ')){
          name = name.replace(' ','+');
        }
        if(this.access_token === undefined) throw 'Application did not authenticate';
        var requestOptions = {
          url: `https://api.spotify.com/v1/search?q=${name}&type=${type}`,
          headers: {
            'Authorization': 'Bearer ' + this.access_token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          json: true
        };
        request.get(requestOptions,(err,res,body) => {
          if(Spotty.checkSuccessful(err,res)){
            fulfill(new Artist(body.artists.items[0],this.access_token));
          }else{
            reject(res.statusCode);
          }
        });
      });
    }

    test(){
        return this;
    }

    static checkSuccessful(err,res){
      return !err && (res.statusCode == 201 || res.statusCode == 200);
    }
};
