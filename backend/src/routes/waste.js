const { Router } = require('express');
const jwt = require('jsonwebtoken');
const verifyToken = require('./validate-token');
const cookieParser = require('cookie-parser');
const Waste = require('../models/waste');
const Company = require('../models/company');
const User = require('../models/User');
const router = Router();
router.get('/register', verifyToken, function(req, res) {
  const jwt = jwt.decode(req.cookies.jwt)
  const data = req.body;
  const company= Company.findById(jwt.company_id);
  const waste = new Waste({
  type: data.type,
  description: data.description,
  company: jwt.company_id
  });
  const savedWaste = await waste.save();
  company.wastes.push(savedWaste._id);
  company.save()
  res.send(savedWaste);
});
module.exports = router;