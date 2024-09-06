var express = require('express');
var router = express.Router();
var Company = require('../models/company');
router.post('/register', async function(req, res, next) {
  const data = req.body;
  try {
    const company = new Company({ name: data.name });
    await company.save();
    res.send('Company registered successfully');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
