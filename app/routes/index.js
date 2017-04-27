let express = require('express');
let router = new express.Router();
let config = require('config');
let mongo = require('mongodb').MongoClient;
let mConf = config.get('mongo');
let url = 'mongodb://' + mConf.host + ':' + mConf.port + '/' + mConf.database;
let stockSymbols = config.get('stock').get('symbols');

function connectToDB() {
  mongo.connect(url, function(err, db) {
    if (err || !db) {
      console.log('Unable to connect to database. Exiting...');
      exit(1);
    } else {
      console.log('Successfully connected to database');
      return db;
    }
  });
}


router.get('/', function(req, res) {
  mongo.connect(url, function(err, db) {
    if (err || !db) {
      console.log('Unable to connect to database. Exiting...');
      exit(1);
    } else {
      console.log('Successfully connected to database');
      let collection = db.collection('weather');

      collection.findOne({}, function(err, item) {
        let weather = item;
        let counter = 0;
        let stocks = [];
        let collectionStocks = db.collection('stock');
        for (let i = 0; i < stockSymbols.length; ++i) {
          collectionStocks.findOne({symbol: stockSymbols[i]}, function(err, item) {
            stocks.push(item);
            if (++counter === stockSymbols.length) {
              collection.findOne({}, function(err, temp) {
                let forecastcollection = db.collection('forecast');
                forecastcollection.find({}, function(err, forecast) {
                  console.log(forecast);
                  res.render('index', {
                    weather: temp,
                    forecast: forecast,
                    stock: stocks,
                  });
                });
              });
            }
          });
        }
      });
    }
  });
});

module.exports = router;
