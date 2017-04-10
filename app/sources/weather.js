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
  updateForcast(db);
};

/**
 * Requests current weather and commits to mongo.
 * @param {database} db The mongo database.
 */
function updateCurrent(db) {
  let host = 'http://api.openweathermap.org';
  let path = '/data/2.5/weather?zip=' + zip + '&appid=' + token;
  request(host + path, function(error, response, body) {
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);
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
 * Requests forcasted weather and commits to mongo.
 * @param {database} db The mongo database/
 */
function updateForcast(db) {
    // TODO
};

module.exports = {update};
