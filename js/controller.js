(function (angular) {
    'use strict';

    function myCtrl(AnnyangService,
                    ClockService,
                    WeatherService,
                    DustService,
                    GeolocationService,
                    MusicService,
                    NewsService,
                    GmailListService,
                    CalendarService,
                    TrafficService,
                    $scope, $interval, $timeout, $sce) {

        let _this = this;
        var command = COMMANDS.ko;
        var DEFAULT_COMMAND_TEXT = command.default;
        var functionService = FUNCTIONSERVICE;

        // instantiate google map objects for directions
        var directionsDisplay = new google.maps.DirectionsRenderer();
        var directionsService = new google.maps.DirectionsService();
        var geocoder = new google.maps.Geocoder();

        $scope.listening = false;
        $scope.complement = command.hi; //안녕 Zele!
        $scope.focus = "default"; //사용가능한 질문이라 말해보세요
        $scope.user = {};
        /*'사용 가능 한 질문'이라고 말해보세요.*/
        $scope.interimResult = DEFAULT_COMMAND_TEXT;
        $scope.destination = "목적지를말해주세요."

        $scope.map = {
            control: {},
            center: {
                latitude: 37.588442,
                longitude: 127.006197
            },
            zoom: 15
        };
        // marker object
        $scope.marker = {
            center: {
                latitude: 37.588442,
                longitude: 127.006197
            }
        }

        var restCommand = function () {
            $scope.interimResult = DEFAULT_COMMAND_TEXT;
        }

        var restDestination=function(){
           // $scope.destination="목적지를말해주세요."
                var request = {
                    origin: new google.maps.LatLng(37.588442, 127.006197),
                    //: document.getElementById('destination').value,
                    //destination: $interimResult,
                    destination: $scope.destination,
                    provideRouteAlternatives: true,
                    travelMode: eval("google.maps.DirectionsTravelMode.TRANSIT")
                };
                directionsService.route(request, function (response, status) {
                    if (status === google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(response);
                        directionsDisplay.setMap($scope.map.control.getGMap());
                        directionsDisplay.setPanel(document.getElementById('directionsList'));
                        $scope.showList = true;

                    } else {
                        console.log('Goog9le route unsuccesfull!');
                    }
                });
        }

        _this.init = function () {

            restCommand();

            // 시간
            let clockData = function () {
                $scope.clock = ClockService.printClock();
            }
            clockData();
            $interval(clockData, 1000);

            // 날씨
            let weatherData = function () {
                //GeolocationService.init().then(function(geo){
                WeatherService.init().then(function () {
                    $scope.currentForecast = WeatherService.currentForecast();
                    $scope.weekly = WeatherService.weeklyForecast();
                });
                // })
            }
            weatherData();
            $interval(weatherData, 360000);//날씨데이터 갱신

            // 미세먼지
            let dustData = function () {
                DustService.init().then(function () {
                    $scope.dust = DustService.dustForecast();
                });
            }
            dustData();
            $interval(dustData, 1000);



            // 메일
          /*  let gmail = function () {
                $scope.message = GmailListService.list()
            }
            gmail();
            //주기 늘림
            $interval(gmail, 36000);

            let calendar = function () {
                CalendarService.init().then(function (token) {
                    $scope.calendar = CalendarService.list(token)
                })
            }
            calendar();
            //주기 늘림
            $interval(calendar, 36000);*/


            var defaultView = function () {
                functionService.defaultHome($scope);//홈으로 이동
            }

            /*초기화면*/
            AnnyangService.addCommand(command.home, defaultView);
            /*SAM 켜기*/
            AnnyangService.addCommand(command.wake, function () {
                functionService.wake($scope);
            });
            /*사용가능한 질문*/
            AnnyangService.addCommand(command.whatcanisay, function () {
                functionService.whatCanISay($scope);
            });
            /*인사*/
            AnnyangService.addCommand(command.name, function (name) {
                console.debug("Hi", name, "nice to meet you");
                $scope.user.name = name;
                functionService.name($scope, $scope.user.name);
            });
            /*주간 날씨*/
            AnnyangService.addCommand(command.weather, function () {
                functionService.weather($scope, WeatherService, DustService);
            });

            /*뉴스기사*/
            AnnyangService.addCommand(command.news, function () {
                functionService.news($scope, NewsService);
            })
            /*영상 재생*/
            AnnyangService.addCommand(command.playvideo, function (term) {
                functionService.music($scope, $sce, MusicService, term);
            })
            AnnyangService.addCommand(command.playmusic, function (term) {
                functionService.music($scope, $sce, MusicService, term);
            })
            /*영상 정지*/
            AnnyangService.addCommand(command.stopyoutube, function () {
                functionService.stopyoutube($scope);
            });
            /*SAM 끄기*/
            AnnyangService.addCommand(command.sleep, function () {
                console.debug("Ok, going to sleep...");
                $scope.focus = "sleep";
            });
            /*일상 대화*/
            AnnyangService.addCommand(command.name, function (name) {//나는 00야
                $scope.user.name = name;
                functionService.name($scope, $scope.user.name);
            });
            /*길 찾 기*/
            AnnyangService.addCommand(command.direction,function(){

                AnnyangService.start(function (listening) {
                    $scope.listening = listening;
                }, function (destination) {
                    $scope.destination = destination;
                    $timeout.cancel(restDestinationout);
                }, function (result) {
                    $scope.destination = result[0];
                    $timeout(restDestination, 1000);
                    restDestinationout=$timeout($scope.destination,5000)
                });
                $scope.focus="direction"
            })

            /*교통편*/
            AnnyangService.addCommand(command.traffic,function(){
                var traffic=function() {
                    functionService.traffic($scope, TrafficService)
                }
                traffic();
                $interval(traffic,1000,10);
            })



            var resetCommandTimeout;
            var restDestinationout;
            //Track when the Annyang is listening to us

            AnnyangService.start(function (listening) {
                $scope.listening = listening;
            }, function (interimResult) {
                $scope.interimResult = interimResult;
                $timeout.cancel(resetCommandTimeout);
            }, function (result) {
                $scope.interimResult = result[0];
                resetCommandTimeout = $timeout(restCommand, 5000);
            });
            //

        };

        _this.clearResults = function () {
            _this.results = [];
        };

        _this.init();
    }

    angular.module('myApp').controller('myCtrl', myCtrl);

}(window.angular));