var express = require('express');
var cookieParser = require('cookie-parser');
var bcrypt = require('bcrypt');  // Asegúrate de importar bcrypt
var router = express.Router();
var User = require('../models/user');

router.use(cookieParser());

router.get('/cookie', function(req, res) {
  res.cookie("cookieTest", 'cookie_value').send('Cookie is set');
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* POST register user. */
router.post('/register', async function(req, res, next) {
  const data = req.body;
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = new User({ username: data.username, age: data.age, email: data.email, role: "user", password: hashedPassword });
    await user.save();
    res.send('User registered successfully');
  } catch (error) {
    next(error);
  }
});

/* POST login user. */
router.post('/login', async function(req, res, next) {
  const data = req.body;
  try {
    const user = await User.findOne({ email: data.email }).exec();
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.send('Login successful');
  } catch (error) {
    next(error);
  }
});

module.exports = router;