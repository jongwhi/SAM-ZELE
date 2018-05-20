/*
 여기서의 myApp 이라는 이름을 가진 Application 모듈을 선언해주는 부분
* */
(function(angular) {
    'use strict';
    //엄격 모드 -> 변수나 함수를 선언만 하고 사용않음. 변수의 이름을 잘못입력하게되면 새로운 전역 변수가 만들어짐


    angular.module('myApp', ['ngAnimate','google-maps']);
    /*[] 부분은 Dependency 라고 하는데 외부모듈을 가져와 사용하는 부분*/

    }(window.angular));
    //window 객체-전역객체로 선언