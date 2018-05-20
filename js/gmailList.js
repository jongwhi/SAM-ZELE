(function() {
    'use strict';

    function gmail() {

        var fs = require('fs');
        var {google} = require('googleapis');
        var googleAuth = require('google-auth-library');
        var TOKEN_PATH = './gmail_file/minwoo_Gmail_Token.json';

        let service = {};
        service.gmail=null;

        service.list=function(){

            /* secret key 와 token */
            var credentials=JSON.parse(fs.readFileSync('./gmail_file/gmail_client_secret.json','utf8'));
            var clientSecret = credentials.installed.client_secret;
            var clientId = credentials.installed.client_id;
            var redirectUrl = credentials.installed.redirect_uris[0];
            var auth = new googleAuth();
            var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

            var token = fs.readFileSync(TOKEN_PATH, 'utf8')
            oauth2Client.credentials=JSON.parse(token)

            /*gmail messaage */
            var gmail = google.gmail('v1');
            gmail.users.messages.list({
                auth: oauth2Client,
                userId: 'me',
            }, function (err, response) {
                if(err) return err;
                for (let i = 0; i < 5; i++) {
                    let Id = response.messages[i].id;
                    google.gmail('v1').users.messages.get({
                        auth: oauth2Client,
                        userId: 'me',
                        id: Id,
                        format: 'raw'
                    }, (err, rawMail) => {
                        if(err) service.gmail=err;
                        var message=rawMail.snippet;
                        service.gmail=`${i+1}번째 메일 : `+message.substr(0,80)+"..";
                    })
                }
            })

            return service.gmail;
        }
        return service;

    }
    angular.module('myApp').factory('GmailListService',gmail);
}());