function printClock() {
    var currentDate = new Date(); // 현재시간
    var calendar = currentDate.getFullYear() + "-" + (currentDate.getMonth()+1) + "-" + currentDate.getDate() // 현재 날짜
    var amPm = 'AM'; // 초기값 AM
    var currentYear = addZeros(currentDate.getFullYear(),2);
    var currentMonth = addZeros(currentDate.getMonth()+1,2);
    var currentDay = addZeros(currentDate.getDate(),2);
    var currentDate2 = currentDate.getDay();
    var currentHours = addZeros(currentDate.getHours(),2);
    var currentMinute = addZeros(currentDate.getMinutes() ,2);
    var currentSeconds =  addZeros(currentDate.getSeconds(),2);
    var clockData;

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

    clockData = "<span style='font-size:18px;'>" +currentYear +"/"+ currentMonth+"/" + currentDay +"   "+currentDate2+"</span><br>"+currentHours+":"+currentMinute+""+ amPm;
    return clockData; //날짜를 출력해 줌
}

function addZeros(num, digit) { // 자릿수 맞춰주기
    var zero = '';
    num = num.toString();
    if (num.length < digit) {
        for (i = 0; i < digit - num.length; i++) {
            zero += '0';
        }
    }
    return zero + num;
}