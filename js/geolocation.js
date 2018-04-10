(function(){
    'use strict';
    
    function geolocation($http){
        let service = {};
        service.geo = null;
        service.init = function(){
            return $http.get("http://ip-api.com/json").then(function(res){
                return service.geo = res;
            });
        }
        return service;
    }
    angular.module('myApp').factory('GeolocationService',geolocation);
}());