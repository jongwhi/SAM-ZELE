(function(){
    'use strict';
    var AWS = require('aws-sdk');
// https 모듈과 같이 데이터 통신 역할을 하는 $http
    function rekog() {

        let service = {}; //객체 초기자 , 객체 생성;
        service.rekog = new AWS.Rekognition({
            accessKeyId: config.aws.accessKeyId,
            secretAccessKey: config.aws.secretAccessKey,
            region: config.aws.region
        });
        
        return service;
    }
    angular.module('myApp').factory('DustService',dust);
    //controller에 WeatherService 라는 이름의 서비스로 주입가능
    //forcast 의 return 값 을 사용가능.
}());