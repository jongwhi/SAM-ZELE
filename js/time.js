(function(){
    'use strict';
    function clock(){
        let service = {};
        service.clock = {};
        
        service.printClock = function(){
            let currentDate = new Date(); // 현재시간
            let calendar = currentDate.getFullYear() + "-" + (currentDate.getMonth()+1) + "-" + currentDate.getDate() // 현재 날짜
            let amPm = 'AM'; // 초기값 AM
            let currentYear = addZeros(currentDate.getFullYear(),2);
            let currentMonth = addZeros(currentDate.getMonth()+1,2);
            let currentDay = addZeros(currentDate.getDate(),2);
            let currentDate2 = currentDate.getDay();
            let currentHours = addZeros(currentDate.getHours(),2);
            let currentMinute = addZeros(currentDate.getMinutes() ,2);
            let currentSeconds =  addZeros(currentDate.getSeconds(),2);
            
            if(currentHours >= 12){ // 시간이 12보다 클 때 PM으로 세팅, 12를 빼줌
                amPm = 'PM';
                currentHours = addZeros(currentHours - 12,2);
            }
            if(currentDate2 == 0){
                currentDate2 = "Sunday"
            }else if(currentDate2 == 1){
                currentDate2 = "Monday"
            }else if(currentDate2 == 2){
                currentDate2 = "Tuseday"
            }else if(currentDate2 == 3){
                currentDate2 = "Wednesday"
            }else if(currentDate2 == 4){
                currentDate2 = "Thursdsay"
            }else if(currentDate2 == 5){
                currentDate2 = "Friday"
            }else if(currentDate2 == 6){
                currentDate2 = "Saturday"
            }
            
            service.clock.year = currentYear;
            service.clock.month = currentMonth;
            service.clock.day = currentDay;
            service.clock.date = currentDate2;
            service.clock.hour = currentHours;
            service.clock.minute = currentMinute;
            service.clock.ampm = amPm;
            
            return service.clock; //날짜를 출력해 줌
        }
        service.addZeors= function(num,digit) { // 자릿수 맞춰주기
            let zero = '';
            num = num.toString();
            if (num.length < digit) {
                for (i = 0; i < digit - num.length; i++) {
                    zero += '0';
                }
            }
            return zero + num;
        }
        return service;
    }
    
    angular.module('myApp').factory('ClockService',clock);
    //controller에 WeatherService 라는 이름의 서비스로 주입가능
    //forcast 의 return 값 을 사용가능.
}());