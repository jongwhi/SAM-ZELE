(function(angular){
    'use strict';
    
    function myCtrl(WeatherService,DirectionService,$scope,$interval){
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
            
            let directionData = function(){
                DirectionService.init().then(function(){
                    $scope.currentDirections = DirectionService.currentDirections();
                });
            }
            directionData();
            $interval(directionData,1000);
        }

        _this.init();
    }
    angular.module('myApp').controller('myCtrl',myCtrl);
    // 모듈.controller("컨트롤러명", constructor function)
    // constructor function 에 해당하는 함수는 html 에 ng-controller 지시어를 만나면 호출된다.

        
}(window.angular));


