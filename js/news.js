(function() {
    'use strict';

    function news($http) {

        let service = {};
        service.news = null;

        service.init = function() {
            return $http.get("https://newsapi.org/v2/top-headlines?country=kr&apiKey="+config.news.key)
                .then(function (response) {
                return service.news = response;
            });
        }
        service.topicNews = function() {
            if (service.news === null) {
                return "null";
            }
            for (var i = 0; i < service.news.data.articles.length; i++) {
                service.news.data.articles[i].image=service.news.data.articles[i].urlToImage;
                service.news.data.articles[i].title = service.news.data.articles[i].title;
                service.news.data.articles[i].des = service.news.data.articles[i].description;
            }
            return service.news.data;
        }
        return service;
    }
    angular.module('myApp').factory('NewsService', news);
}());