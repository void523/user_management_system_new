const dotenv = require("dotenv");
dotenv.config();

/**
 * Function for email verification
 * @param {string} recepient the email id of a newly registered user 
 * @param {string} content   body of the email containing verification token
 */

exports.verifyMail = (recepient,content)=>{
    var https = require('follow-redirects').https;
    var fs = require('fs');
    
    var options = {
      'method': 'POST',
      'hostname': 'api.sendinblue.com',
      'path': '/v3/smtp/email',
      'headers': {
        'accept': 'application/json',
        'api-key': process.env.BLUE_API_KEY,
        'content-type': 'application/json'
      },
      'maxRedirects': 20
    };
    
    var req = https.request(options, function (res) {
      var chunks = [];
    
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });
    
      res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
      });
    
      res.on("error", function (error) {
        console.error(error);
      });
    });
    
    var postData = JSON.stringify({
      "sender": {
        "name": "abhi",
        "email": "abhimadhu523@gmail.com"
      },
      "to": [
        {
          "email": recepient
        }
      ],
      "subject": "Email verification",
      "htmlContent": content
    });
    
    req.write(postData);
    
    req.end();
  }

/**
 * Function to initiate password reset
 * @param {string} recepient user who wants to reset password
 * @param {string} content body of email containing reset token
 */

  exports.resetMail = (recepient,content)=>{
    var https = require('follow-redirects').https;
    var fs = require('fs');
    
    var options = {
      'method': 'POST',
      'hostname': 'api.sendinblue.com',
      'path': '/v3/smtp/email',
      'headers': {
        'accept': 'application/json',
        'api-key': process.env.BLUE_API_KEY,
        'content-type': 'application/json'
      },
      'maxRedirects': 20
    };
    
    var req = https.request(options, function (res) {
      var chunks = [];
    
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });
    
      res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
      });
    
      res.on("error", function (error) {
        console.error(error);
      });
    });
    
    var postData = JSON.stringify({
      "sender": {
        "name": "abhi",
        "email": "abhimadhu523@gmail.com"
      },
      "to": [
        {
          "email": recepient
        }
      ],
      "subject": "Password Reset",
      "htmlContent": content
    });
    
    req.write(postData);
    
    req.end();
  }