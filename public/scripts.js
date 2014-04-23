$(document).ready(function(){

  var map = L.mapbox.map('map', 'ardouglass.i25bo5jg', {zoomControl: false, tileLayer: {detectRetina: true}});
  map.setView([40.7590615,-73.969231], 12);

  //Disable controls
  map.dragging.disable();
  map.touchZoom.disable();
  map.doubleClickZoom.disable();
  map.scrollWheelZoom.disable();
  if (map.tap) map.tap.disable();

  $("#location").click(function(){
    if(!navigator.geolocation) {
      map.setView([29, -95], 8);
    } 
    else {
      navigator.geolocation.getCurrentPosition(function(position) {
        $.getJSON('/locate', {lat: position.coords.latitude, lon: position.coords.longitude}, function(data) {
          
          if(data.located) {
            map.setView([data.lat, data.lon], 15);
            
            $('#logo').hide();
            $('#location').hide();

            var directions = {
              flat: position.coords.latitude,
              flon: position.coords.longitude,
              tlat: data.lat,
              tlon: data.lon
            };

            $.getJSON('/route', directions, function(route) {
              console.log(route);
            });
          }

        });
      });
    }
  });

});
