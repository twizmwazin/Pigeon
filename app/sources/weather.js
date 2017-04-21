/*
 * A source to get weather using the OpenWeatherMap API. On update(), all
 * relevant data is stored in mongo, ready to be used by the front-end.
 */
let request = require('request');
let config = require('config');
let weatherConf = config.get('weather');
let token = weatherConf.get('token');
let zip = weatherConf.get('zip');

/**
 * Updates all data for this module.
 * @param {database} db The mongo database/
 */
function update(db) {
  updateCurrent(db);
  updateForecast(db);
};

/**
 * Requests current weather and commits to mongo.
 * @param {database} db The mongo database.
 */
function updateCurrent(db) {
  let host = 'http://api.openweathermap.org';
  let path = '/data/2.5/weather?zip=' + zip + '&appid=' + token;
  request(host + path, function(error, response, body) {
    console.log('weather error:', error);
    console.log('weather statusCode:', response && response.statusCode);
    let jbody = JSON.parse(body);
    let commit = {
      city: jbody.name,
      weather: jbody.weather,
      temp: jbody.main.temp,
    };
    db.createCollection('weather', function(err, collection) {
      let docs = collection.find({}).toArray();
      collection.insertOne(commit);
      for (let i = 0; i < docs.length; ++i) {
        collection.deleteOne(docs[i]);
      }
      console.log('Updated weather successfully.');
    });
  });
};

/**
 * Requests forecasted weather and commits to mongo.
 * @param {database} db The mongo database/
 */
function updateForecast(db) {
  let host = 'http://api.openweathermap.org';
  let path = '/data/2.5/forecast?zip=' + zip + '&appid=' + token;
  request(host + path, function(error, response, body) {
    console.log('forecast error:', error);
    console.log('forecast statusCode:', response && response.statusCode);
    let jbody = JSON.parse(body);
    db.createCollection('forecast', function(err, collection) {
      for (let i = 0; i < jbody.list.size; ++i) {
        collection.deleteMany({dt: jbody.list[i].dt});
        collection.insertOne(jbody.list[i]);
      }
      console.log('Updated forecast successfully.');
    });
  });
};

module.exports = {update};
