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

router.get('/routes/stocks', function(req, res) {
  mongo.connect(url, function(err, db) {
    if (err || !db) {
      console.log('Unable to connect to database. Exiting...');
      exit(1);
    } 
    else {
      console.log('Successfully connected to database');
      let counter = 0;
      let stocks = [];
      let collectionStocks = db.collection('stock');  
      for (let i = 0; i < stockSymbols.length; ++i) {
        collectionStocks.findOne({symbol: stockSymbols[i]}, function(err, item) {
          stocks.push(item);  
          if (++counter === stockSymbols.length) {
            console.log(stocks);
            res.render('stocks', {
              stock: stocks,
            });
          }
        });
      }
      let collection = db.collection('stocks');
    }
  });
});

module.exports = router;
