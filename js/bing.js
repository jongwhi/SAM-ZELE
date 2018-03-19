(function(){
    'use strict';
    function BingMap($http, $q){
        var service = {};
        var duration = null;
        var BING_MAPS = "http://dev.virtualearth.net/REST/V1/Routes/";
        service.getTravelDuration = function(){
            var deferred = $q.defer();
            // Request traffic info for the configured mode of transport
            $http.get(getEndpoint(config.bingmap.mode)).then(function(response){
                // Walking and Transit are "not effected" by traffic so we don't use their traffic duration
                if(config.bingmap.mode == "Transit" || config.bingmap.mode == "Walking"){
                    deferred.resolve(moment.duration(response.data.resourceSets[0].resources[0].travelDuration, 'seconds'));
                } else {
                    deferred.resolve(moment.duration(response.data.resourceSets[0].resources[0].travelDurationTraffic, 'seconds'));
                }
            }, function(error){
                // Most of the time this is because an address can't be found
                if(error.status === 404){
                    console.error('No transit information available between start and end');
                    deferred.reject('Unavailable');
                } else{
                    console.error(error.statusText);
                    deferred.reject('Unknown error');
                }
                duration = deferred.promise;
            });
            return deferred.promise;
        };
        
        // Depending on the mode of transport different paramaters are required.
        function getEndpoint(mode){
            var endpoint =BING_MAPS+mode+"?wp.0="+config.bingmap.origin+"?wp.1="+config.bingmap.destination;
            if(mode == "Driving"){
                endpoint += "&avoid=minimizeTolls";
            } else if(mode == "Transit"){
                endpoint += "&timeType=Departure&dateTime="+moment().format('h:mm:ssa').toUpperCase();
            } else if(mode == "Walking"){
                endpoint += "&optmz=distance";
            }
            endpoint += "&key="+config.bingmap.key;
            return endpoint;
        }
        return service;
    }
    angular.module('myApp').factory('BingmapService',BingMap);
}());