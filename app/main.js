// {{{ Express HTTP server setup
let express = require('express');
let less = require('less-middleware');
let app = express();

// Set up EJS views
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
// Set LESS for CSS pre-processing
app.use(less(__dirname + '/static'));
// Set up static directory
app.use(express.static(__dirname + '/static'));

const port = 3000;

// Routers
let index = require('./routes/index');
let weather = require('./routes/weather');
let stocks= require('./routes/stocks');

app.use('/', index);
app.use('/', weather);
app.use('/', stocks);
// }}}

// {{{ MongoDB database client setup
let mongo = require('mongodb').MongoClient;
let config = require('config');

let mConf = config.get('mongo');
let url = 'mongodb://' + mConf.host + ':' + mConf.port + '/' + mConf.database;
console.log(url);

mongo.connect(url, function(err, db) {
  if (err || !db) {
    console.log('Unable to connect to database. Exiting...');
    exit(1);
  } else {
    console.log('Successfully connected to database');
    initSources(db);
  }
});

// }}}

app.listen(port);
// Log to console
console.log('Pigeon has started.');
console.log(__dirname);
console.log('Listening for connections on port ' + port + '.');

// {{{ Functions
function initSources(database) {
  let dispatcher = require('./sources/dispatch');
  dispatcher.run(database);
}

// }}}
