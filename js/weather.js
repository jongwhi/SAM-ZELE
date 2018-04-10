(function(){
    'use strict';
// https 모듈과 같이 데이터 통신 역할을 하는 $http
    function forecast($http) {

        let service = {}; //객체 초기자 , 객체 생성;
        service.forecast = null; //객체 속성 초기화

        service.init = function (geo) {
            return $http.get('https://api.darksky.net/forecast/'+config.forecast.key+'/'+geo.data.lat+','+geo.data.lon)
                .then(function (response) {
                    return service.forecast = response;
                });
        }

        service.currentForecast = function () {
            if (service.forecast === null) {
                return  null;
            }
            service.forecast.data.currently.temperature = parseFloat((service.forecast.data.currently.temperature-32)/1.8).toFixed(1);
            service.forecast.data.currently.wi = "wi-forecast-io-" + service.forecast.data.currently.icon;

            return service.forecast.data.currently;
        }
        
        return service;
    }
    angular.module('myApp').factory('WeatherService',forecast);
    //controller에 WeatherService 라는 이름의 서비스로 주입가능
    //forcast 의 return 값 을 사용가능.
}());
