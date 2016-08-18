var winston = require('winston');
require('winston-logstash');
var util = require('util');
var fs = require('fs');
if (!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs');
}
require('events').EventEmitter;
var Mail = require('winston-mail').Mail;
var fs = require('fs');
if (!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs');
}
var config = {
    levels: {
        silly: 0,
        verbose: 1,
        info: 2,
        data: 3,
        warn: 4,
        debug: 5,
        error: 6
    },
    colors: {
        silly: 'magenta',
        verbose: 'cyan',
        info: 'green',
        data: 'grey',
        warn: 'yellow',
        debug: 'blue',
        error: 'red'
    }
};
var customLogger = new winston.Logger({
    transports: [
        //log information server
        new winston.transports.Console({
            level: 'debug'
        }),
        //transports history server via day
        new winston.transports.DailyRotateFile({
            silent: false,
            colorize: true,
            timestamp: true,
            json: true,
            prettyPrint: true,
            showLevel: true,
            formatter: true,
            filename: './logs/log'
        }),
    ],
    levels: config.levels,
    colors: config.colors
});

var logstashLogger = new winston.Logger({
    transports : [
        new winston.transports.Logstash ({
            port : 3015,
            node_name : "eform_core_3015_log",
            host: "172.19.0.8",
            level: 'verbose',
            colorize: false,
        }),
	new winston.transports.Console({
            level: 'verbose',
            colorize: true,
            prettyPrint: true,
        }),
   ],
   levels: config.levels,
   colors: config.colors
})

customLogger.add(Mail, {
    host: "smtp.gmail.com",
    port: 465,
    ssl: true,
    username: 'meditek.manage.system@gmail.com',
    password: 'meditek123456',
    subject: 'Debug Production EFormServer 3015',
    from: 'Meditek Production <meditek.manage.system@gmail.com>',
    to: 'ThanhDev <thanh.dev.meditek@gmail.com>, Khuong PM <thekhuong@gmail.com>, MinhDevOps <minhnguyen@telehealthvietnam.com.vn>',
    level: 'error'
});

var log = {};
if (process.argv.indexOf("--logtest") >= 0) {
    console.log("||||||||||||||||||||||| LOG: LOG TEST");
    log['level'] = 'verbose';
} else {
    if (process.env.NODE_ENV === 'production') {
        log['custom'] = customLogger;
    } else {
        log['custom'] = logstashLogger;
    }
}



// Override console.log. All console.log is now treated at debug level of winston log.
// function formatArgs(args){
//     return [util.format.apply(util.format, Array.prototype.slice.call(args))];
// }

// console.log = function(){
//     logstashLogger.debug.apply(logstashLogger, formatArgs(arguments));
// }

module.exports.log = log;
