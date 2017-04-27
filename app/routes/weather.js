let express = require('express');
let router = new express.Router();
let config = require('config');
let mongo = require('mongodb').MongoClient;
let mConf = config.get('mongo');
let url = 'mongodb://' + mConf.host + ':' + mConf.port + '/' + mConf.database;

router.get('/routes/weather', function(req, res) {
  mongo.connect(url, function(err, db) {
    if (err || !db) {
      console.log('Unable to connect to database. Exiting...');
      exit(1);
    } else {
      console.log('Successfully connected to database');
      let collection = db.collection('weather');
      collection.findOne({}, function(err, item) {
        let forecastcollection = db.collection('forecast');
        forecastcollection.find({}).toArray(function(err, forecast) {
          res.render('weather', {
            weather: item,
            forecast: forecast,
          });
        });
      });
    }
  });
});

module.exports = router;
