/**
 * Created by tannguyen on 23/06/2016.
 */
var meditek_library = require('meditek_library');
var socketIOClient = require('socket.io-client');
var sailsIOClient = require('sails.io.js');
var io = sailsIOClient(socketIOClient);
var o = sails.config.myconf;
module.exports = meditek_library.NCI(sailsIOClient, sailsIOClient, io, o.urlNc);
