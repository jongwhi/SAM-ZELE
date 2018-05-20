var FUNCTIONSERVICE = {

    defaultHome: function ($scope) {
        if (responsiveVoice.voiceSupport()) {
            responsiveVoice.speak("홈으로 이동합니다.", "Korean Female");
        }
        $scope.focus = "default";
    },

    whatCanISay: function ($scope) { //사용 가능한 질문
        if (responsiveVoice.voiceSupport()) {
            responsiveVoice.speak("사용가능한 메뉴들 입니다.", "Korean Female");
        }
        $scope.focus = "commands";
    },



    /*기능 실행*/
    news: function ($scope, NewsService) { //뉴스 보여줘
        NewsService.init().then(function () {
            $scope.currentNews = NewsService.topicNews();
            $scope.focus = "news";
        });
        if (responsiveVoice.voiceSupport()) {
            responsiveVoice.speak("현재 Topic입니다.", "Korean Female");
        }
    },

    music: function ($scope, $sce, MusicService, term) { //영상 보여줘
        MusicService.init(term).then(function () {
            // ex) 클래식, 최신가요, 특정노래제목
            $scope.focus = "music";
            $scope.getVideoId = MusicService.getVideoId();
            $scope.youtubeurl = "http://www.youtube.com/embed/" + $scope.getVideoId + "?autoplay=1&enablejsapi=1&version=3";
            $scope.currentYoutubeUrl = $sce.trustAsResourceUrl($scope.youtubeurl);
        });
    },

    stopyoutube: function ($scope) { //꺼줘
        var iframe = document.getElementsByTagName("iframe")[0].contentWindow;
        iframe.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
        $scope.focus = "default";
        if (responsiveVoice.voiceSupport()) {
            responsiveVoice.speak("영상을 종료합니다.", "Korean Female");
        }
    },
    
    route: function ($scope, $document, term) { //~까지 어떻게 가
        console.log(term);
        $scope.focus = "route";
        //$scope.directions.destination = term;
        
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
    },



    /*인사말, 대화*/
    wake: function ($scope) { //안녕 쌤!
        if (responsiveVoice.voiceSupport()) {
            responsiveVoice.speak("안녕하세요", "Korean Female");
        }
        $scope.focus = "default";
    },

    name: function ($scope, name) { //나는 00야
        if (responsiveVoice.voiceSupport()) {
            responsiveVoice.speak("반가워요" + name + "님. 오늘도 멋지시네요!", "Korean Female");
        }
        $scope.focus = "name";
    },

    weather: function ($scope, WeatherService, DustService) { //날씨 어때?
        WeatherService.init().then(function () {
            var currentForecast = WeatherService.currentForecast();
            var dust = DustService.dustForecast();

            if (responsiveVoice.voiceSupport()) {
                if (currentForecast.temperature < 10 && dresponsiveVoice.voiceSupport()) {
                    responsiveVoice.speak("현재 기온이 10도 이하로 쌀쌀하니,  따듯하게 입으세요!", "Korean Female");
                } else {
                    responsiveVoice.speak("대체적으로 따듯한 날씨인 것 같아요!", "Korean Female");
                }
            }
        });
    }


}