const { Router } = require('express');
const jwt = require('jsonwebtoken');
const verifyToken = require('./validate-token');
const cookieParser = require('cookie-parser');
const Waste = require('../models/waste');
const Company = require('../models/company');
const User = require('../models/User');
const router = Router();

router.post('/register', verifyToken, async (req, res, next) => {
  const token = jwt.decode(req.cookies.jwt)
  const data = req.body;
  const company = await Company.findById(token.company_id);
  const waste = new Waste({
    type: data.type,
    description: data.description,
    company: token.company_id,
    quantity: data.quantity,
    measure_unit: data.measure_unit
  });
  const savedWaste = await waste.save();
  console.log(company)
  company.wastes.push(savedWaste._id);
  await company.save()
  res.send(savedWaste);
});
module.exports = router;
