let express = require('express');
let app = express();

const port = 3000;

// Static directory
app.use(express.static(__dirname + '/static'));

app.listen(port);
// Log to console
console.log('Pigeon has started.');
console.log(__dirname);
console.log('Listening for connections on port ' + port + '.');
