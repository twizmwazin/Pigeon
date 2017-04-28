/*
 * A source to get weather using the OpenWeatherMap API. On update(), all
 * relevant data is stored in mongo, ready to be used by the front-end.
 */
let request = require('request');
let config = require('config');
let weatherConf = config.get('weather');
let token = weatherConf.get('token');
let zip = weatherConf.get('zip');
let moment = require('moment');

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
    if (error) {
      console.error('weather error:', error);
      console.error('weather statusCode:', response && response.statusCode);
    }
    let jbody = JSON.parse(body);
    let commit = {
      city: jbody.name,
      weather: jbody.weather,
      temp: jbody.main.temp,
      updated: Date.now(),
    };
    db.createCollection('weather', function(err, collection) {
      collection.deleteMany({}, function(err, res) {
        collection.insertOne(commit);
      });
      console.log('Updated weather successfully.');
    });
  });
};

/**
 * Creates the database commit for the forecast of a given day.
 * @param {int} day The day number (1-5)
 * @param {list} all All forecast as given by the API
 * @return {object} The object to commit to mongo.
 */
function createDay(day, all) {
  let result = {
    day: day,
    min: -1,
    max: -1,
    icon: null,
  };

  let dayTimes = [];
  let midnight = moment().add(day, 'days').startOf('day').unix();
  for (let i = 0; i < all.length; ++i) {
    if (all[i].dt >= midnight && all[i].dt < midnight + 86400) {
      dayTimes.push(all[i]);
    }
  }
  for (let i = 0; i < dayTimes.length; ++i) {
    if (result.min == -1 || dayTimes[i].main.temp_min < result.min) {
      result.min = dayTimes[i].main.temp_min;
    }
    if (result.max == -1 || dayTimes[i].main.temp_max > result.max) {
      result.max = dayTimes[i].main.temp_max;
    }
  }
  result.icon = dayTimes[Math.floor(dayTimes.length / 2)].weather[0].icon;
  return result;
}


/**
 * Requests forecasted weather and commits to mongo.
 * @param {database} db The mongo database/
 */
function updateForecast(db) {
  let host = 'http://api.openweathermap.org';
  let path = '/data/2.5/forecast?zip=' + zip + '&appid=' + token;
  request(host + path, function(error, response, body) {
    if (error) {
      console.error('forecast error:', error);
      console.error('forecast statusCode:', response && response.statusCode);
    }
    let jbody = JSON.parse(body);
    let commits = [];
    for (let i = 1; i <= 5; ++i) {
      commits.push(createDay(i, jbody.list));
    }
    db.createCollection('forecast', function(err, collection) {
      collection.deleteMany({}, function(err, res) {
        collection.insertMany(commits);
      });
      console.log('Updated forecast successfully.');
    });
  });
};

module.exports = {update};
