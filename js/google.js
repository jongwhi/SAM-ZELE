var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();
    var map;
 
    function initialize() {
      directionsDisplay = new google.maps.DirectionsRenderer();
      var chicago = new google.maps.LatLng(37.588442, 127.006197);
      var mapOptions = {
        zoom:15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: chicago
      }
      map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      directionsDisplay.setMap(map);
    }
 
    function calcRoute() {
      var start = new google.maps.LatLng(37.588442, 127.006197);
      var end = document.getElementById('end').value;
 
      var request = {
          origin:start,
          destination:end,
          travelMode: eval("google.maps.DirectionsTravelMode.TRANSIT")
      };
      directionsService.route(request, function(response, status) {
        alert(status);  // 확인용 Alert..미사용시 삭제
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
      });
    }
 
    google.maps.event.addDomListener(window, 'load', initialize);