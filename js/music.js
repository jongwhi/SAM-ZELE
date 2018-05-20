(function () {
    'use strict';
    // https 모듈과 같이 데이터 통신 역할을 하는 $http
    function MusicService($http) {

        var service = {};
        service.youtube = null;

        service.init = function (term) {
            return $http.get('https://www.googleapis.com/youtube/v3/search?part=snippet&q='+term+'&key=' + config.youtube.key + '&maxResults=30&type=video')
                .then(function (response) {
                    return service.youtube = response;
                });
        }

        service.getVideoId = function () {
            if (service.youtube === null) {
                return null;
            }
            var firstVideo = service.youtube.data.items[0];
            var videoId = firstVideo.id.videoId;

            return videoId;
        }
        return service;
    }
    angular.module('myApp').factory('MusicService', MusicService);

}());




/*var Youtube = require('youtube-node');
        var youtube  = new Youtube();
        youtube.setKey('AIzaSyB7cQt5ML147cjCmT30NGFVnMW6QNRFAJ4'); // API 키 입력

        //// 검색 옵션 
        youtube.addParam('order', 'rating'); // 평점 순으로 정렬
        youtube.addParam('type', 'video'); // 타입 지정
        youtube.addParam('videoLicense', 'creativeCommon');
        // 크리에이티브 커먼즈 아이템만 불러옴

        service.searchYoutube = function (search_term, limit) {
            youtube.search(search_term, limit, function (err, result) { // 검색 실행
                if (err) {
                    console.log(err);
                    return;
                } // 에러일 경우 에러공지하고 빠져나감

                service.youtube = result["items"];// 결과 중 items 항목만 가져옴
                return service.youtube
            });
        }

        service.getVideoId = function () {           
            var it = service.youtube[0];
            var videoId = it["id"]["videoId"];
        
            return videoId;
        }
        return service;   */