var meditek_library=require('meditek_library');
var socketIOClient= require('socket.io-client');
var sailsIOClient=require('sails.io.js');
var io=sailsIOClient(socketIOClient);
module.exports=meditek_library.NCI(sailsIOClient,sailsIOClient,io,'http://localhost:3016');