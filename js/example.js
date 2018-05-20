var fs = require('fs');
var {google} = require('googleapis');
var googleAuth = require('google-auth-library');
var TOKEN_PATH = '../gmail_file/minwoo_Gmail_Token.json';


function result(){
var credentials=JSON.parse(fs.readFileSync('../gmail_file/gmail_client_secret.json','utf8'));
var clientSecret = credentials.installed.client_secret;
var clientId = credentials.installed.client_id;
var redirectUrl = credentials.installed.redirect_uris[0];
var auth = new googleAuth();
var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
var gmail = google.gmail('v1');
/*return fs.readFile(TOKEN_PATH, function (err, token) {
    if (err) {
        console.log("토큰이 필요하다는 에러")
    } else {
        oauth2Client.credentials = JSON.parse(token);
        //litMessages(oauth2Client);
        return service.gmail.token = oauth2Client;
    }
});*/
var token = fs.readFileSync(TOKEN_PATH, 'utf8')
oauth2Client.credentials=JSON.parse(token);
    //return console.log(typeof(oauth2Client));
   // return oauth2Client
    gmail.users.messages.list({
            auth: oauth2Client,
            userId: 'me',
            maxResults: 1
        }, function (err, response) {
            return response;
            for (let i = 0; i < 3; i++) {
                let Id = response.messages[i].id;
                gmail.users.messages.get({
                    auth: oauth2Client,
                    userId: 'me',
                    id: Id,
                    format: 'raw'
                }, (err, rawMail) => {
                    if(err) return "안됨";
                    //return console.log(typeof(rawMail.snippet));
                    return console.log(rawMail);
                })
            }
})

    /*var messagelist = function(){
        return new Promise(function (resolve,reject){
            gmail.users.messages.list({
                auth: oauth2Client,
                userId: 'me',
                maxResults: 1
            },(err,response) => {
                if(err){ return reject(err)}
                return console.log(response);
            })
        });
    }

    messagelist*/

    /*var gmail = google.gmail('v1');

    async.waterfall([
        function(callback){
            gmail.users.messages.list({
                auth: oauth2Client,
                userId: 'me',
            }, function (err, response) {
                if(err) callback(err)
                callback(response)
            })
        }
    ],function(err,result){
        console.log(result);
    })
*/
}
//gmailexample()
result()
function authorize(){
    var credentials=JSON.parse(fs.readFileSync('../gmail_file/gmail_client_secret.json','utf8'));
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    return new Promise((resolve,reject)=>{

        fs.readFile(TOKEN_PATH,function(err,token){
            if(err){
                resolve(err);
            }
            else{
                oauth2Client.credentials=JSON.parse(token);
                resolve(oauth2Client);
            }
        })
    })
}

 function gmail(auth){
       /* var gmail = google.gmail('v1');
        return gmail.users.messages.list({
            auth: auth,
            userId: 'me',
        },function(err,response){
            if(err){
                return err;
            }
            return response;
        })*/
       return new Promise((resolve,reject)=>{
       const gmail =google.gmail({version:'v1',auth:auth});
       const res =  gmail.users.messages.list({userId:'me'});
       return resolve(res);

       })
   /* var gmail = google.gmail('v1');
     gmail.users.messages.list({
        auth: auth,
        userId: 'me',
    }, function (err, response) {
        //console.log(response.messages);
         return response;
        for (let i = 0; i < 1; i++) {
            let Id = response.messages[i].id;
            gmail.users.messages.get({
                auth: auth,
                userId: 'me',
                id: Id,
                format: 'raw'
            }, (err, rawMail) => {
                if(err) return "안됨";
                //return console.log(typeof(rawMail.snippet));
                return rawMail.snippet;
            })
        }
    })*/
}


/*authorize().then(auth=>{
    //console.log(gmail(auth));
    gmail(auth).then(result=>{
        console.log(result)
    })
}).catch(error => {
    console.error(error);
});*/
