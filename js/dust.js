(function(){
    'use strict';
// https 모듈과 같이 데이터 통신 역할을 하는 $http
    function dust($http) {

        let service = {}; //객체 초기자 , 객체 생성;
        service.dust = null; //객체 속성 초기화

        service.init = function () {
            return $http.get('http://openapi.seoul.go.kr:8088/'+config.dust.key+'/json/ForecastWarningMinuteParticleOfDustService/1/1/')
                .then(function (response) {
                    return service.dust = response;
                });
        }

        service.dustForecast = function () {
            if (service.dust === null) {
                return  null;
            }
            var msg = service.dust.data.ForecastWarningMinuteParticleOfDustService.RESULT.MESSAGE;
            return msg;
        }
        
        return service;
    }
    angular.module('myApp').factory('DustService',dust);
    //controller에 WeatherService 라는 이름의 서비스로 주입가능
    //forcast 의 return 값 을 사용가능.
}());
