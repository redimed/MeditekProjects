var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MobileDetect = require('mobile-detect');
//tham khao: http://hgoebl.github.io/mobile-detect.js/doc/MobileDetect.html
var sportInjuryLink={
  AndroidOS:'https://play.google.com/store/apps/details?id=telehealth.redimed.sportinjury',
  BlackBerryOS:'',
  PalmOS:'',
  SymbianOS:'',
  WindowsMobileOS:'',
  WindowsPhoneOS:'',
  iOS:'https://itunes.apple.com/us/app/redimed-health-sports-injury/id1055589877?ls=1&mt=8', 
  MeeGoOS:'',
  MaemoOS:'',
  JavaOS:'',
  webOS:'',
  badaOS:'',
  BREWOS:'',
};

var workInjuryLink={
  AndroidOS:'https://play.google.com/store/apps/details?id=com.mobirix.dragonseal&hl=en',
  BlackBerryOS:'',
  PalmOS:'',
  SymbianOS:'',
  WindowsMobileOS:'',
  WindowsPhoneOS:'',
  iOS:'https://itunes.apple.com/us/app/webmd-trusted-health-wellness/id295076329?mt=8', 
  MeeGoOS:'',
  MaemoOS:'',
  JavaOS:'',
  webOS:'',
  badaOS:'',
  BREWOS:'',
};


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

app.get('/download/app/sport-injury',function(req,res){
  var md = new MobileDetect(req.headers['user-agent']);
  var os=md.os();
  console.log("======================OS:"+os+"===========================");
  if(os)
  {
    if(sportInjuryLink[os]!==null)
    {
      if(sportInjuryLink[os])
      {
        res.redirect(sportInjuryLink[os]);
      }
      else
      {
        res.send('link not defined');
      }
      
    }
    else
    {
      res.send('unknown os');
    }
  }
  else
  {
    res.send('os not found');
  }

})

app.get('/download/app/work-injury',function(req,res){
  var md = new MobileDetect(req.headers['user-agent']);
  var os=md.os();
  console.log("======================OS:"+os+"===========================");
  if(os)
  {
    if(workInjuryLink[os]!==null)
    {
      if(workInjuryLink[os])
      {
        res.redirect(workInjuryLink[os]);
      }
      else
      {
        res.send('link not defined');
      }
      
    }
    else
    {
      res.send('unknown os');
    }
  }
  else
  {
    res.send('os not found');
  }

})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
