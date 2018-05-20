(function() {
    'use strict';

    function calendar() {

        const fs = require('fs');
        const readline = require('readline');
        const {google} = require('googleapis');
        const OAuth2Client = google.auth.OAuth2;


        let service = {};
        service.calendar=null;

        service.init=function(){
            const credentials = JSON.parse(fs.readFileSync('./gmail_file/client_secret.json', 'utf8'));
            //console.log(credentials)
            const TOKEN_PATH = './gmail_file/minwoo_Calendar_Token.json';
            const {client_secret, client_id, redirect_uris} = credentials.installed;
            const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

            const token = fs.readFileSync(TOKEN_PATH, 'utf8');
            return new Promise((resolve,reject)=>{
                fs.readFile(TOKEN_PATH, (err, token) => {
                    if (err) return reject(err);
                    //oAuth2Client.setCredentials(JSON.parse(token))
                    oAuth2Client.credentials=JSON.parse(token)
                    return resolve(oAuth2Client);
                });
            })

        }

        service.list=function(oAuth2Client){
            const calendar = google.calendar({version: 'v3'/*, oAuth2Client*/});
            calendar.events.list({
                calendarId: 'primary',
                timeMin: (new Date()).toISOString(),
                maxResults: 5,
                singleEvents: true,
                orderBy: 'startTime',
                auth:oAuth2Client
            }, (err, {data}={}) => {
                if (err) return service.calendar=err;
                const events = data.items;
                if (events.length) {
                    console.log('Upcoming 10 events:');
                    /*events.map((event, i) => {
                        const start = event[i].start.dateTime || event[i].start.date;
                        service.calendar=`${start} - ${event[i].summary}`;
                    });*/
                    service.calendar=events;
                    /*service.calendar[i].start=events[i].start.dateTime || events[i].start.date;
                    service.calendar[i].summary=events[i].summary;*/
                } else {
                    console.log('No upcoming events found.');
                }
            });
            return service.calendar
        }
        return service;
    }
    angular.module('myApp').factory('CalendarService',calendar);
}());



