var https = require("https");
var weatherdata="";
var array= new Array();

function printForecast(){
    var result = forecast();
    return result;
}

function forecast(){
    https.get("https://api.darksky.net/forecast/02dea48a50f8772adc70d77d54675fe0/37.8267,127.4233",function(res){
        var info = "";

        res.on("data", function (chunk) {
            info += chunk;
        });
        
        res.on("end", function result(){
            var data = JSON.parse(info);
            array[0] = data.timezone;
            array[1] = data.currently.temperature;
            array[2] = data.currently.icon;
            weatherdata = array;
        });
    });
    return weatherdata;
}
//export this function to use that in main file
module.exports.forecast = forecast;