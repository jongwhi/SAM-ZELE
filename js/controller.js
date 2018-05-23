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

        //길찾기 관련변수
        var directionsDisplay = new google.maps.DirectionsRenderer();
        var directionsService = new google.maps.DirectionsService();
        var geocoder = new google.maps.Geocoder();


        //웹캠 관련변수
        var enabled = false; // A flag to know when start or stop the camera
        var WebCamera = require("webcamjs"); // Use require to add webcamjs
        var remote = require('electron').remote; // Load remote component that contains the dialog dependency
        var fs = require('fs'); // Load the File System to execute our common tasks (CRUD)

        // aws 관련변수
        var AWS = require('aws-sdk');
        var options = {
            accessKeyId:"",
            secretAccessKey:"",
            region:"ap-northeast-1"
        }
        var S3 = new AWS.S3(options);
        var rekognition = new AWS.Rekognition(options);

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

        //웹캠 시작
        var webcamStart =function() {
            return new Promise(function(resolve,reject){
                if (!enabled) {
                    enabled = true;
                    return resolve(WebCamera.attach('#camdemo'));
                } else {
                    //return reject(WebCamera.reset());  //Webcam 이 리셋되면 안됨.

                }
            })
            };

        //웹캠 파일 저장
        var savephoto=function() {
            console.log("Save button clicked");
            if (enabled) {
                return WebCamera.snap(function (data_uri) {
                    var now = new Date();
                    var fileName = __dirname+'/UserFaces/' + now.getFullYear() + now.getMonth() + now.getDate() + "_" + now.getHours() + now.getMinutes() + now.getSeconds() + '.png';
                    console.log(fileName);

                    var imageBuffer = processBase64Image(data_uri);

                    try {
                        fs.mkdirSync('UserFaces');
                    } catch (e) {
                        if (e.code != 'EEXIST') throw e; // 존재할경우 패스처리함.
                    }

                    fs.writeFile(fileName, imageBuffer.data, function (err) {
                        if (err) {
                            console.log("Cannot save the file :'( time to cry !");
                        } else {
                            console.log("Image saved succesfully");
                        }
                    });

                });
            } else {
                console.log("Please enable the camera first to take the snapshot !");
            }
        }

        //image 변환
        function processBase64Image(dataString) {
            var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
                response = {};

            if (matches.length !== 3) {
                return new Error('Invalid input string');
            }

            response.type = matches[1];
            response.data = new Buffer(matches[2], 'base64');

            return response;
        }

        //길찾기 정보
        var restDestination=function(){
                var request = {
                    origin: new google.maps.LatLng(37.588442, 127.006197),
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
                if (responsiveVoice.voiceSupport()) {
                    responsiveVoice.speak("길찾기입니다.", "Korean Female");
                }
                $scope.focus="direction"
            })
            /*교통편*/
            AnnyangService.addCommand(command.traffic,function(){
                if (responsiveVoice.voiceSupport()) {
                    responsiveVoice.speak("교통편입니다.", "Korean Female");
                }
                var traffic=function() {
                    functionService.traffic($scope, TrafficService)
                }
                traffic();
                $interval(traffic,1000,10);
            })

            /*사용자 정보 화면*/
            AnnyangService.addCommand(command.user,function(){
                if (responsiveVoice.voiceSupport()) {
                    responsiveVoice.speak("민우님의 사용자 정보입니다.", "Korean Female");
                }
                var user=function() {
                    functionService.user($scope, GmailListService, CalendarService);
                }
                user();
                $interval(user,5000,20);
            });

            /* 카메라 */
            AnnyangService.addCommand(command.webcam,function() {
                AnnyangService.start(function () {
                    //webcam 시작 후 6초뒤 사진 저장
                    webcamStart().then(function () {
                        $timeout(savephoto, 6000);
                    })
                });
        });


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