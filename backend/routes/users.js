var express = require('express');
var cookieParser = require('cookie-parser');
var bcrypt = require('bcrypt');  // Asegúrate de importar bcrypt
var router = express.Router();
var User = require('../models/User');
var Company = require('../models/company');
const jwt = require('jsonwebtoken');
const verifyToken = require('./validate-token');
router.use(cookieParser());
router.get('/cookie', verifyToken, function(req, res) {
  res.send({response:jwt.decode(req.cookies.jwt)});

});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.cookie("jwt", "blasadbaikuhj").send('Cookie is set');
});

/* POST register user. */
router.post('/register', async function(req, res, next) {
  const data = req.body;

  try {
    const company = await Company.findById(data.companyId);

    if (!company) {
      return res.status(400).send('La empresa no existe');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = new User({
      username: data.username,
      age: data.age,
      email: data.email,
      role: "user",
      password: hashedPassword,
      company: company._id
    });

    const savedUser = await user.save();
    company.employees.push(savedUser._id);
    await companny.save()
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
    // create token
    const token = jwt.sign({
      name: user.username,
      id: user._id
    }, process.env.TOKEN_SECRET)
    res.cookie("jwt", token,{
      httpOnly: true,  // La cookie no es accesible desde el lado del cliente (JavaScript)
      secure: true,    // Solo se envía en conexiones HTTPS
      sameSite: 'Strict', // Evita ataques CSRF
      maxAge: 3600000   // Expira en 1 hora
    }).send('Cookie is set');
  } catch (error) {
    next(error);
  }
});
router.post('/logout', function(req, res) {


  // Clearing the cookie
  res.clearCookie('jwt').send('Cookie cleared');

});
module.exports = router;
