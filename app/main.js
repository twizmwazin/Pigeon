let express = require('express');
let less = require('less-middleware');
let app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(less(__dirname + '/static'));
app.use(express.static(__dirname + '/static'));

const port = 3000;

// Routers
let index = require('./routes/index');

app.use('/', index);

app.listen(port);
// Log to console
console.log('Pigeon has started.');
console.log(__dirname);
console.log('Listening for connections on port ' + port + '.');
