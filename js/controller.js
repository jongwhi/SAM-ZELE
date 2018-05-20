(function (angular) {
    'use strict';

    function myCtrl(AnnyangService,
        ClockService,
        WeatherService,
        DustService,
        GeolocationService,
        MusicService,
        NewsService,
        $scope, $interval, $timeout, $sce, $document) {

        let _this = this;
        var command = COMMANDS.ko;
        var DEFAULT_COMMAND_TEXT = command.default;
        var functionService = FUNCTIONSERVICE;
        $scope.listening = false;
        $scope.complement = command.hi; //안녕 Zele!
        $scope.focus = "default"; //사용가능한 질문이라 말해보세요
        $scope.user = {};
        /*'사용 가능 한 질문'이라고 말해보세요.*/
        $scope.interimResult = DEFAULT_COMMAND_TEXT;

        var restCommand = function () {
            $scope.interimResult = DEFAULT_COMMAND_TEXT;
        }

        _this.init = function () {

            restCommand();
            /*let trafficData = function () {
                var API_DOMAIN = 'http://openapi.its.go.kr';
                var key = '1523844711801';
                var NOPOP_LAYERS = [];

                window.onload = init;
                var map;
                $scope.init = TrafficService.init();
            }
            trafficData();*/

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
            $interval(weatherData, 360000); //날씨데이터 갱신

            // 미세먼지
            let dustData = function () {
                DustService.init().then(function () {
                    $scope.dust = DustService.dustForecast();
                });
            }
            dustData();
            $interval(dustData, 1000);


            var defaultView = function () {
                functionService.defaultHome($scope); //홈으로 이동
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
            /*뉴스 기사*/
            AnnyangService.addCommand(command.news, function () {
                functionService.news($scope, NewsService);
            });
            /*영상 재생*/
            AnnyangService.addCommand(command.playvideo, function (term) {
                functionService.music($scope, $sce, MusicService, term);
            });
            AnnyangService.addCommand(command.playmusic, function (term) {
                functionService.music($scope, $sce, MusicService, term);
            });
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
            AnnyangService.addCommand(command.name, function (name) { //나는 00야
                $scope.user.name = name;
                functionService.name($scope, $scope.user.name);
            });
            /* 길찾기 */
            /*AnnyangService.addCommand(command.route, function (term) {
                functionService.route($scope,$document,term);
            });*/
            // 길찾기
            /*let mapData = function () {
                $scope.focus = "route";
                $scope.map = {
                    control: {},
                    center: {
                        latitude: 37.588442,
                        longitude: 127.006197
                    },
                    zoom: 15
                };

                $scope.marker = {
                    center: {
                        latitude: 37.588442,
                        longitude: 127.006197
                    }
                };

                // instantiate google map objects for directions
                var directionsDisplay = new google.maps.DirectionsRenderer();
                var directionsService = new google.maps.DirectionsService();
                var geocoder = new google.maps.Geocoder();

                // get directions using google maps api
                $scope.getDirections = function (term) {
                    var request = {
                        origin: new google.maps.LatLng(37.588442, 127.006197),
                        destination: document.getElementById('destination').value,
                        provideRouteAlternatives: true,
                        travelMode: eval("google.maps.DirectionsTravelMode.TRANSIT")
                    };
                    directionsService.route(request, function (response, status) {
                        if (status === google.maps.DirectionsStatus.OK) {
                            directionsDisplay.setDirections(response);
                            directionsDisplay.setMap($scope.map.control.getGMap());
                            directionsDisplay.setPanel(document.getElementById('directionsList'));
                            $scope.directions.showList = true;
                        } else {
                            alert('Google route unsuccesfull!');
                        }
                    });
                }
            }
            mapData();*/


            var resetCommandTimeout;
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
        };

        _this.clearResults = function () {
            _this.results = [];
        };

        _this.init();
    }
    angular.module('myApp')
        /*.directive('map', function () {
        return {
            restrict: 'AE',
            scope: {
                setFn: '&'
            },
            link: function (scope, element, attrs) {
                var API_DOMAIN = 'http://openapi.its.go.kr';
                var key = '1523844711801';
                var NOPOP_LAYERS = [];
                var map;
                scope.updateMap = function () {
                    map = new OpenLayers.Map({
                        div: "map",
                        projection: new OpenLayers.Projection('EPSG:900913'),
                        displayProjection: new OpenLayers.Projection('EPSG:4326'),
                        units: "m",
                        maxExtent: new OpenLayers.Bounds(13489539, 3828608, 14943678, 4881604),
                        restrictedExtent: new OpenLayers.Bounds(13489539, 3828608, 14943678, 4881604),
                        layers: [
    				new OpenLayers.Layer.Vworld_Base('Vworld', {
                                numZoomLevels: 17,
                                transitionEffect: ''
                            })
    			],
                        controls: [
    				new OpenLayers.Control.Navigation()
    				, new OpenLayers.Control.MousePosition()
    				, new OpenLayers.Control.ScaleLine()
    				, new OpenLayers.Control.PanZoomBar({
                                zoomWorldIcon: true
                            })
    				, new OpenLayers.Control.LayerSwitcher()
    				, new OpenLayers.Control.OverviewMap({
                                layers: [new OpenLayers.Layer.OSM()],
                                mapOptions: {
                                    projection: 'EPSG:900913'
                                },
                                autoPan: true,
                                maximized: true
                            })
    			]
                    });
                    // 지도 초기 위치 설정
                    map.setCenter(new OpenLayers.LonLat(14142832, 4514272), 12); //좌우-,상+하
                    // 교통정보 시작
                    var ntic = new Ntic('nticLayer');
                    NOPOP_LAYERS.push(ntic.getLayer());
                    // 교통정보 종료
                    map.addLayers(NOPOP_LAYERS);
                }
                scope.setFn({
                    theDirFn: scope.updateMap
                });
            }
        }
    })*/.controller('myCtrl', myCtrl);

}(window.angular));