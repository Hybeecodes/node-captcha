var express = require('express');
var bodyParser = require('body-parser');
var Client = require('node-rest-client').Client;
var client = new Client();


var credentials = require('./credentials.js');


var app = express();

app.get('/',function(req,res,next){
    // console.log(credentials.secret_key);
    res.sendFile(__dirname +'/index.html')
});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/',function(req,res,next){
    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
      }
    
    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + credentials.secret_key + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
    client.post(verificationUrl, function (response) {
        if(response.success)
            res.send('User verified');
        else
            res.send('Error verifying user');
    });
})

app.listen(3000,function(){
    console.log('server started running on port 3000');
})