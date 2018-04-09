(function(angular){
    'use strict';
    
    function myCtrl(WeatherService,DustService,ClockService,$scope,$interval){
        /* $scope
        * view와 controller의 매개체 역할
        * controller을 통해 scope에 model과 function을 정의해두면 view가 그것을 사용한다.
        * function는 return 값으로 / 변수는 값으로 정의할수 있다.*/

        let _this= this;

        _this.init=function(){
            let refreshMirrorData =function() {
                WeatherService.init().then(function () {
                    $scope.currentForecast = WeatherService.currentForecast();
                });
            }
            refreshMirrorData();
            $interval(refreshMirrorData,1000);
            
            let refreshDustData = function(){
                DustService.init().then(function(){
                    $scope.dust = DustService.dustForecast();
                });
            }
            refreshDustData();
            $interval(refreshDustData,1000);
            
            let clockData = function(){
                $scope.clock = ClockService.printClock();
            }
            clockData();
            $interval(clockData,1000);

            /*
            let refreshBingmapData = function(){
                BingmapService.getTravelDuration().then(function(durationTraffic){
                    $scope.traffic = {
                        name: config.bingmap.name,
                        origin: config.bingmap.origin,
                        destination: config.bingmap.destination,
                        hours: durationTraffic.hours(),
                        minutes: durationTraffic.minutes()
                    };
                });
            }
            refreshBingmapData();
            $interval(refreshBingmapData,1000);
            */
        }

        _this.init();
    }
    angular.module('myApp').controller('myCtrl',myCtrl);
    // 모듈.controller("컨트롤러명", constructor function)
    // constructor function 에 해당하는 함수는 html 에 ng-controller 지시어를 만나면 호출된다.

        
}(window.angular));


