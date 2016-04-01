var Gelf = require('gelf');
var gelf = new Gelf({
  graylogPort: 12201,
  graylogHostname: 'localhost',
  connection: 'wan',
  maxChunkSizeWan: 1420,
  maxChunkSizeLan: 8154
});

gelf.emit('gelf.log', 'myshortmessage');


module.exports.gelf = gelf;
