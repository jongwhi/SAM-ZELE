(function(){
    'use strict';
// https 모듈과 같이 데이터 통신 역할을 하는 $http
    function dust($http) {

        let service = {}; //객체 초기자 , 객체 생성;
        service.dust = {};
        service.res = null; //객체 속성 초기화

        service.init = function () {
            return $http.get('http://openapi.seoul.go.kr:8088/'+config.dust.key+'/json/'+config.dust.listair+'/1/5/'+config.dust.code)
                .then(function (response) {
                    return service.res = response;
                });
        }

        service.dustForecast = function () {
            if (service.dust === null) {
                return  null;
            }
            service.dust.name = service.res.data.ListAirQualityByDistrictService.row[0].MSRSTENAME;
            service.dust.pm = service.res.data.ListAirQualityByDistrictService.row[0].PM10;

            if(service.dust.pm <= 30){
                service.dust.pm = "좋음";
            } else if(31 <= service.dust.pm <= 80){
                service.dust.pm = "보통";
            } else if(81 <= service.dust.pm <= 150){
                service.dust.pm = "나쁨";
            } else if(151 <= service.dust.pm){
                service.dust.pm = "매우나쁨";
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
ListAirQualityByDistrictService/	서비스명
1/					페이징 시작번호
5/					페이징 끝번호
111171/					측정소 행정코드 (선택-입력시 해당 측정소 측정량만 요청)

ListAirQualityByDistrictService
	list_total_count	총 데이터 건수
	RESULT
		CODE		요청결과 코드
		MESSAGE		요청결과 메시지
	row
		MSRDATE		측정날짜
		MSRADMCODE	측정소 행정코드
		MSRSTENAME	측정소명
		MAXINDEX	통합대기환경지수
		GRADE		통합대기환경지수 등급
		POLLUTANT	지수결정물질
		NITROGEN	이산화질소 단위:ppm
		OZONE		오존 단위:ppm
		CARBON		일산화탄소 단위:ppm
		SULFUROUS	아황산가스 단위:ppm
		PM10		미세먼지 단위:마이크로그람/3제곱미터
		PM25		초미세먼지 단위:마이크로그람/3제곱미터
*/