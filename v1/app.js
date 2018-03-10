var $ = require('jquery');
var benji = require('./benji.js');
var ben = new benji();
var server = ben.serverInit();
var token;
//processing to happen before running any routes

server.use(function(req, res, next) {
    //maybe do JWT processing here?
    //token = "samplesecret";
    var requestToken;
    if(req.body) requestToken = req.body.token;
    if(ben.verifyToken(requestToken)){
       //Decode the token
       jwt.verify(token,"samplesecret",function(err,decod){
         if(err) {
             res.json({
             message:"Wrong Token"
           });
         }
         else {
           //If decoded then call next() so that respective route is called.
           req.decoded=decod;
         }
       });
       return next();
     }
     else {
       res.send('AUTH ERROR');
       return;
     }
});

//API paths
var PATH = "" //instantiate path variable
PATH = "/hello/:name"
server.get({path: PATH, version: '1.0.0'}, respond);
server.head({path: PATH, version: '1.0.0'}, respond);

PATH = "/hello/:name"
server.get({path: PATH, version: '2.0.0'}, respondWithDateTime);
server.head({path: PATH, version: '2.0.0'}, respondWithDateTime);

PATH = '/categories/get'
server.get({path: PATH, version: '1.0.0'}, getCategories)
server.head({path: PATH, version: '1.0.0'}, getCategories)

PATH = '/categories/get/:ID'
server.get({path: PATH, version: '1.0.0'}, getCategoryById)
server.head({path: PATH, version: '1.0.0'}, getCategoryById)

PATH = '/users/get/:ID'
server.get({path: PATH, version: '1.0.0'}, getUserById);
server.head({path: PATH, version: '1.0.0'}, getUserById);



//Route not found, use the method below to log such requests then the "return cb()"
//line will handle returning the error message
server.on('NotFound', function (req, res, err, cb) {
  //logging stuff
  return cb();
});

//functions to call from API
function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

function respondWithDateTime(req, res, next){
    res.send('Hello ' + req.params.name + ".  It is " + Date())
}

function getCategories(req, res, next){
  //select all active categories
  pool.query('SELECT * from public.get_categories()', (err, result) => {

    res.send(result.rows);
  })
}

function getCategoryById(req, res, next){
  pool.query('SELECT * from public.get_single_category('+req.params.ID+')', (err, result) => {
    res.send(result.rows);
  })
}


function getUserById(req, res, next){
  pool.query('SELECT * from public.get_user('+req.params.ID+')', (err, result) => {
    res.send(result.rows);

  })
}
