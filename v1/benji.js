module.exports = function () {
  //Benji
  const {Pool, Client} = require('pg');
  var restify = require('restify');
  var jwt = require('jsonwebtoken');
  var server = restify.createServer();
  var token;
  this.serverInit = function () {
     return server;
  }

  this.jwt=require('jsonwebtoken');

  this.pool = new Pool({
    user: 'homelessadmin',
    host: 'homelessapp.comf0z7yu2yl.us-east-2.rds.amazonaws.com',
    database: 'homeless_app',
    password: 'GreenChicken18',
    port: 5432,
  });

  var users=[
  {
    name:"benji",
    password:"benji"
  },
  {
    name:"techies",
    password:"forgood"
  }
  ];

  this.verifyToken = function (reqToken) {
    return verifyToken(reqToken);
  };

  var verifyToken = function(reqToken) {
    if(token === reqToken){
      return true;
    }
    else {
      return false;
    }
  }


  server.use(restify.plugins.bodyParser({ mapParams: true }));

  server.post({path: '/auth'},function(req,res,next){
      var message;
      for(var user of users){
        if(user.name!=req.body.user){
            message="Wrong Name";
            break;
        } else {
            if (user.password!=req.body.password) {
                message="Wrong Password";
                break;
            }
            else {
              //create the token.
                var user = req.body.user;
                var password = req.body.password;
                token=jwt.sign(user,"samplesecret");
                message="Login Successful";
                //If token is present pass the token to client else send respective message
                if (token) {
                    res.json({
                        message,
                        token,
                        user,
                        password
                    });
                    console.log(token);
                }
                else {
                    res.json({
                        message
                    });
                }
                break;
            }
        }
        console.log(message);
      }
  });

  server.post({path: '/verifyAuth'},function(req,res,next){
      var message;
      for(var user of users){
        if(user.name!=req.body.user){
            message="Wrong Name " + req.body.user;
            break;
        } else if (user.password!=req.body.password) {
                message="Wrong Password";
                break;
            }
            else if (verifyToken(req.body.token)){
              var user = req.body.user;
              var password = req.body.password;
              //create the token.
                ///token=jwt.sign("benji","samplesecret");
                message="Login Successful";
                res.json({
                    message,
                    token,
                    user,
                    password
                });
                console.log(token);
                break;
            }
            else {
              message="Login Unsuccessful";
              res.send(400, 'Failed to Authenticate');
            }
        console.log(message);
      }
  });

  server.get(/\/\/?.*/, restify.plugins.serveStatic({
      directory: __dirname
  }));

  server.listen("8080", function() {
    console.log('%s listening at %s', server.name, server.url);
  });

}
