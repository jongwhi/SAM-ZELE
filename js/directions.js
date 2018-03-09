(function(){
    'use strict';
// https 모듈과 같이 데이터 통신 역할을 하는 $http
    function direction($http) {

        let service = {}; //객체 초기자 , 객체 생성;
        service.direction = null; //객체 속성 초기화

        service.init = function () {
            return $http.get('https://maps.googleapis.com/maps/api/directions/json?origin=Chicago,IL&destination=Los+Angeles,CA&waypoints=Joplin,MO|Oklahoma+City,OK&key='+config.direction.key)
                .then(function (response) {
                    return service.direction = response;
                });
        }

        service.currentDirections = function () {
            if (service.direction === null) {
                return  null;
            }
            service.direction.data.routes.legs.steps.distance.text = service.direction.data.routes.legs.steps.distance.text;

            return service.direction.data.routes.legs.steps;
        }
        return service;
    }
    angular.module('myApp').factory('DirectionService',direction);
    //controller에 WeatherService 라는 이름의 서비스로 주입가능
    //forcast 의 return 값 을 사용가능.
}());
