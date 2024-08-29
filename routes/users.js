var express = require('express');
var cookieParser = require('cookie-parser');
var router = express.Router();
var User = require('../models/user');
router.use(cookieParser());
router.get('/cookie',function(req, res){
     res.cookie("cookieTest" , 'cookie_value').send('Cookie is set');
});
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
/* GET users listing. */
router.get('/hola', function(req, res, next) {
  const user = new User({ username: "Bob Smith" ,age:"20",email:"bob@gmail.com",role:"admin" });
  user.save();
  res.send('respond with a resourceesdsd');
});

module.exports = router;
