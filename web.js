var express = require("express");
var logfmt = require("logfmt");
var request = require('request');

var app = express();

app.use(logfmt.requestLogger());
app.use(express.static(__dirname + '/public'));

app.get('/route', function(req, res) {
  
  var options = {
    url: 'http://www.yournavigation.org/api/1.0/gosmore.php',
    qs: {
      flat: req.query.flat,
      flon: req.query.flon,
      tlat: req.query.tlat,
      tlon: req.query.tlon,
      v: "foot",
      format: "geojson"
    },
    headers: {
      "X-Yours-client": "www.bagel.link"
    }
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
     res.send(body);
    }
  })
});

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
    radius_filter: 10000,
    ll: lat + "," + lon
  };

  yelp.search(gimme_bagels, function(error, data) {
    
    var response = {};

    if(data.total) {
      response.located = true;
      response.name = data.businesses[0].name;
      response.url = data.businesses[0].url;
      response.loc = data.businesses[0].location.address[0];
      response.lat = data.region.center.latitude;
      response.lon = data.region.center.longitude;
    }
    else {
      response.located = false;
    }

    res.send(response);
  });
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});