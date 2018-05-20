var clientId = '207101766842-g60dllrejaul5dthva7d33sn3dom5esv.apps.googleusercontent.com'; //choose web app client Id, redirect URI and Javascript origin set to http://localhost
//var apiKey = 'AIzaSyB9lH2Q94i1eYdSCqsNgFWDkWT3zO1gwQ8'; //choose public apiKey, any IP allowed (leave blank the allowed IP boxes in Google Dev Console)
var userEmail = "gaeun121136@gmail.com"; //your calendar Id
var userTimeZone = "Seoul"; //example "Rome" "Los_Angeles" ecc...
var maxRows = 10; //events to shown
var calName = "_______일정_______"; //name of calendar (write what you want, doesn't matter)    
var scopes = 'https://www.googleapis.com/auth/calendar';

//--------------------- From 24h to Am/Pm
function AmPm(num) {
    if (num <= 12) {
        return " am" + num;
    }
    return " pm" + addZeros(num - 12,2);
}
//--------------------- end    

//--------------------- num Month to String
function monthString(num) {
    if (num === "01") {
        return "01";
    } else if (num === "02") {
        return "02";
    } else if (num === "03") {
        return "03";
    } else if (num === "04") {
        return "04";
    } else if (num === "05") {
        return "05";
    } else if (num === "06") {
        return "06";
    } else if (num === "07") {
        return "07";
    } else if (num === "08") {
        return "08";
    } else if (num === "09") {
        return "09";
    } else if (num === "10") {
        return "10";
    } else if (num === "11") {
        return "11";
    } else if (num === "12") {
        return "12";
    }
}
//--------------------- end

//--------------------- from num to day of week
function dayString(num) {
    if (num == "1") {
        return "월"
    } else if (num == "2") {
        return "화"
    } else if (num == "3") {
        return "수"
    } else if (num == "4") {
        return "목"
    } else if (num == "5") {
        return "금"
    } else if (num == "6") {
        return "토"
    } else if (num == "0") {
        return "일"
    }
}
//--------------------- end

//--------------------- client CALL
function handleClientLoad() {
    gapi.client.setApiKey(config.calendar.key);
    checkAuth();
}
//--------------------- end

//--------------------- check Auth
function checkAuth() {
    gapi.auth.authorize({
        client_id: clientId,
        scope: scopes,
        immediate: true
    }, handleAuthResult);
}
//--------------------- end

//--------------------- handle result and make CALL
function handleAuthResult(authResult) {
    if (authResult) {
        makeApiCall();
    }
}
//--------------------- end

//--------------------- API CALL itself
function makeApiCall() {
    var today = new Date(); //today date
    gapi.client.load('calendar', 'v3', function () {
        var request = gapi.client.calendar.events.list({
            'calendarId': userEmail,
            'timeZone': userTimeZone,
            'singleEvents': true,
            'timeMin': today.toISOString(), //gathers only events not happened yet
            'maxResults': maxRows,
            'orderBy': 'startTime'
        });
        request.execute(function (resp) {
            for (var i = 0; i < resp.items.length; i++) {
                var li = document.createElement('li');
                var item = resp.items[i];
                var classes = [];
                var allDay = item.start.date ? true : false;
                var startDT = allDay ? item.start.date : item.start.dateTime;
                var dateTime = startDT.split("T"); //split date from time
                var date = dateTime[0].split("-"); //split yyyy mm dd
                var startYear = date[0];
                var startMonth = monthString(date[1]);
                var startDay = date[2];
                var startDateISO = new Date(startMonth + " " + startDay + ", " + startYear + " 00:00:00");
                var startDayWeek = dayString(startDateISO.getDay());
                var currentDate = new Date();
                var currentYear = addZeros(currentDate.getFullYear(), 2);

                if (startYear == currentYear) {
                    if (allDay == true) { //생일, 기념일 등 하루종일인 일정
                        var str = [
                                '<font size="3" face="courier">',
                                //i, '/',
                                startMonth, '/',
                                startDay, '(',
                                startDayWeek, ')', '</font><font size="3" face="courier"> - ', item.summary, '</font><br><br>'
                            ];
                    } else { // 특정 시간이 정해진 일정
                        var time = dateTime[1].split(":");
                        var startHour = AmPm(time[0]);
                        var startMin = time[1];
                        var str = [ //change this to match your needs
                                '<font size="3" face="courier">',
                                //i, '/',
                                startMonth, '/',
                                startDay, '(',
                                startDayWeek, ')',
                                startHour, ':', startMin, '</font><font size="3" face="courier"> - ', item.summary, '</font><br><br>'
                            ];
                    }
                    li.innerHTML = str.join('');
                    li.setAttribute('class', classes.join(' '));
                    document.getElementById('events').appendChild(li);
                }
            }
            document.getElementById('calendar').innerHTML = calName;
        });
    });
}
//--------------------- end