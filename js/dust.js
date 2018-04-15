(function(){
    'use strict';
// https 모듈과 같이 데이터 통신 역할을 하는 $http
    function dust($http) {

        let service = {}; //객체 초기자 , 객체 생성;
        service.dust = {};
        service.res = null; //객체 속성 초기화

        service.init = function () {
            return $http.get('http://openapi.seoul.go.kr:8088/'+config.dust.key+'/json/'+config.dust.service+'/1/5/'+config.dust.code+'/'+config.dust.name)
                .then(function (response) {
                    return service.res = response;
                });
        }

        service.dustForecast = function () {
            if (service.dust === null) {
                return  null;
            }
            service.dust.name = service.res.data.RealtimeCityAir.row[0].MSRSTE_NM;
            service.dust.pm = parseInt(service.res.data.RealtimeCityAir.row[0].PM10).toFixed(0);
            service.dust.msg = "";
            
            if(service.dust.pm <= 30){
                service.dust.msg = "좋음";
            } if(30 < service.dust.pm <= 80){
                service.dust.msg = "보통";
            } if(80 < service.dust.pm <= 150){
                service.dust.msg = "나쁨";
            } if(150 < service.dust.pm){
                service.dust.msg = "매우나쁨";
            }
            return service.dust;
        }
        
        return service;
    }
    angular.module('myApp').factory('DustService',dust);
    //controller에 WeatherService 라는 이름의 서비스로 주입가능
    //forcast 의 return 값 을 사용가능.
}());

/*
서울 열린데이터 광장 - 서울시 실시간 자치구별 대기환경 현황
http://openapi.seoul.go.kr:8088/
614b5851676a736535306658654a6c/		인증키 값
json/					요청파일타입 json (xml-xml, xmlf-xml파일, xls-엑셀파일)
RealtimeCityAir/	서비스명
1/					페이징 시작번호
5/					페이징 끝번호
도심권/			권역명 (선택-입력시 해당 측정소 측정량만 요청)

RealtimeCityAir
	list_total_count	총 데이터 건수
	RESULT
		CODE		요청결과 코드
		MESSAGE		요청결과 메시지
	row
		MSRDT         측정일시
        MSRRGN_NM   권역명
        MSRSTE_NM   측정소명
        PM10        미세먼지
        PM25        초미세먼지농도
        O3          오존
        NO2         이산화질소농도
        CO          일산화탄소농도
        SO2         아황산가스농도
        IDEX_NM     통합대기환경등급
        IDEX_MVL    통합대기환경지수
        ARPLT_MAIN  지수결정물질
        
*/