const request = require('request');

module.exports = class Spotty {
    constructor(info){
        this.id = info.client_id;
        this.redirect = info.redirect_uri;
        this.secret = info.client_secret;
    }
    
    auth(){
        return new Promise((fulfill,reject)=>{
            request.post({
                url: 'https://accounts.spotify.com/api/token',
                body: {
                    grant_type: 'client_credentials'
                },
                headers: {
                    'Authorization': `Basic ${this.id}:${this.secret}`,
                    'Content-Type':'application/x-www-form-urlencoded'
                },
                json: true
            },(err,res,body)=>{
                if(!err && res.statusCode == 200){
                    console.log(body);
                }else{
                    reject(res.statusCode);
                }
            })
        })
    }
    
    test(){
        return this;
    }
};