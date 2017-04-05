let express = require('express');
let router = new express.Router();
let config = require('config');
let weatherConf = config.get('weather');
let mongo = require('mongodb').MongoClient;
let mConf = config.get('mongo');
let url = 'mongodb://' + mConf.host + ':' + mConf.port + '/' + mConf.database;
console.log(url);
let database = null;

mongo.connect(url, function(err, db) {
  if (err) {
    console.log('Unable to connect to database. Exiting...');
    exit(1);
  } else {
    console.log('Successfully connected to database');
    database = db;
  }
});


router.get('/routes/weather', function(req, res) {
  let collections = database.collection('weather');
  let temperatureNow = collection.find({}).toArray()[0];
  res.render('weather', temperatureNow);
  
});

module.exports = router;
