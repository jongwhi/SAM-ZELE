/*
*  http method=GET
*  return = response
* */
(function(){
    'use strict';

    function geolocation($http){

        let service ={};
        service.geo=null;
        service.init=function(){
           return $http.get("http://ip-api.com/json").then(function(response){
                return service.geo=response;
            });
        }
        return service;
    }

    angular.module('myApp').factory('GeolocationService',geolocation);
}());


/*
*  http method=GET
*  return = promise 객체
* */
/*
(function(){
    'use strict';

    function geolocation($http,$q){

        var service ={};
        service.geo=null;

        service.init=function(){
            var deferred=$q.defer();
            $http.get("http://ip-api.com/json")
                .then(function(data){
                    if(!data) deferred.reject(data);
                    deferred.resolve(data);
                })
            service.geo= deferred.promise;
            return service.geo;
        }

        return service;
    }

    angular.module('myApp').factory('GeolocationService',geolocation);
}());*/

