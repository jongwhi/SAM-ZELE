(function(){
    'use strict';
// https 모듈과 같이 데이터 통신 역할을 하는 $http
    function forecast($http) {

        let service = {}; //객체 초기자 , 객체 생성;
        service.forecast = null; //객체 속성 초기화

        service.init = function () {
            return $http.get('https://api.darksky.net/forecast/'+config.forecast.key+'/'+config.geolocation.latitude+','+config.geolocation.longitude)
            //return $http.get('https://api.darksky.net/forecast/'+config.forecast.key+'/'+geolocation.data.lat+','+geolocation.data.lon)
                .then(function (response) {
                    return service.forecast = response;
                });
        }

        service.currentForecast = function () {
            if (service.forecast === null) {
                return  null;
            }
            service.forecast.data.currently.temperature = parseFloat((service.forecast.data.currently.temperature-32)/1.8).toFixed(1);
            //service.forecast.data.currently.summary=service.forecast.data.currently.summary;
            service.forecast.data.currently.wi = "wi-forecast-io-" + service.forecast.data.currently.icon;

            return service.forecast.data.currently;
        }

        service.weeklyForecast = function(){
            if(service.forecast === null){
                return null;
            }
            for(var i=0; i<service.forecast.data.daily.data.length; i++){
                var day = moment.unix(service.forecast.data.daily.data[i].time).format('ddd');
                if(day == "Mon") service.forecast.data.daily.data[i].day = "월";
                else if(day == "Tue") service.forecast.data.daily.data[i].day = "화";
                else if(day == "Wed") service.forecast.data.daily.data[i].day = "수";
                else if(day == "Thu") service.forecast.data.daily.data[i].day = "목";
                else if(day == "Fri") service.forecast.data.daily.data[i].day = "금";
                else if(day == "Sat") service.forecast.data.daily.data[i].day = "토";
                else if(day == "Sun") service.forecast.data.daily.data[i].day = "일";

                service.forecast.data.daily.data[i].temperatureMin =addZeros( parseInt((service.forecast.data.daily.data[i].temperatureMin-32)/1.8).toFixed(0),2);
                service.forecast.data.daily.data[i].temperatureMax =addZeros( parseInt((service.forecast.data.daily.data[i].temperatureMax-32)/1.8).toFixed(0),2);
                service.forecast.data.daily.data[i].wi = "wi-forecast-io-"+service.forecast.data.daily.data[i].icon;
            };
            return service.forecast.data.daily.data;
        }

        return service;
    }
    angular.module('myApp').factory('WeatherService',forecast);
    //controller에 WeatherService 라는 이름의 서비스로 주입가능
    //forcast 의 return 값 을 사용가능.
}());
