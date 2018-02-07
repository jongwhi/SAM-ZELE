function WeatherService(){
    URL forecast;
    forecast = new URL("https://api.darksky.net/forecast/0db5c91a03124d53a58af4189b7d0cd0/37.5,127.8");
    var weather = new XMLHttpRequest();
    var data;
    $.ajax({
        url: forecast,
        type: "get",
        success: function(){
            
        }
    })
    weather.onreadystatechange = function(){
        if(weather.readyState === weather.DONE){
            if(weather.status === 200 || weather.status === 201){
                data = weather.responseText;
            } else{
                console.error(weather.responseText);
            }
        }
    };
    weather.open('GET', forecast, true); 
    weather.send();
    return data;
}