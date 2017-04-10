let cron = require('node-cron');

/**
 *  Use node-cron to run source tasks every so often.
 *  @param {database} db The mongodb database
 */
function run(db) {
  let weather = require('./weather');
  cron.schedule('*/5 * * * *', weather.update(db));
};

module.exports = {run};
