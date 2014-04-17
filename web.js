var express = require("express");
var logfmt = require("logfmt");
var app = express();

app.use(logfmt.requestLogger());

app.get('/locate', function(req, res) {
  
  var yelp = require("yelp").createClient({
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    token: process.env.token,
    token_secret: process.env.token_secret
  });

  var lat = "35.223177";
  var lon = "-80.810581";

  if(req.query.lat && req.query.lon) {
    lat = req.query.lat;
    lon = req.query.lon;
  }

  var gimme_bagels = {
    term: "food", 
    limit: 1, 
    sort: 1, 
    category_filter: "bagels", 
    ll: lat + "," + lon
  };

  yelp.search(gimme_bagels, function(error, data) {
    
    var response = {
      name: data.businesses[0].name,
      url: data.businesses[0].url,
      loc: data.businesses[0].location.address[0],
      lat: data.region.center.latitude,
      lon: data.region.center.longitude
    };

    res.send(response);
  });
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});