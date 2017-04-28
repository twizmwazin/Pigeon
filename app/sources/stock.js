/*
 * A source to get live stock data from alphavantage.co.
 * Relevant data is stored in mongo, ready to be used by the front-end.
 */
let request = require('request');
let config = require('config');
let stockConf = config.get('stock');
let token = stockConf.get('token');
let symbols = stockConf.get('symbols');

/**
 * Updates all data for this module.
 * @param {database} db The mongo database/
 */
function update(db) {
  for (let i = 0; i < symbols.length; ++i) {
    db.createCollection('stock', function(err, collection) {
      collection.deleteOne({symbol: symbols[i]});
      request(formatURL(symbols[i], token), function(err, response, body) {
        if (err) {
          console.error('stock error:', err);
          console.error('stock statusCode:', response && response.statusCode);
        }
        let jbody = JSON.parse(body);
        let refreshed = jbody['Meta Data']['3. Last Refreshed'];
        collection.insertOne({
          symbol: symbols[i],
          updated: Date.now(),
          open: jbody['Time Series (Daily)'][refreshed]['1. open'],
          close: jbody['Time Series (Daily)'][refreshed]['4. close'],
        });
        console.log('Updated stocks successfully');
      });
    });
  }
};

/**
 * Formats URL for the API request
 * @param  {string} symbol The stock symbol
 * @param  {string} key    The API key
 * @return {string}        The formatted URL
 */
function formatURL(symbol, key) {
  return 'http://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='
    + symbol + '&apikey=' + key;
}

module.exports = {update};
