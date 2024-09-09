const { Router } = require('express');

const router = Router();
const Company = require('../models/company');

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

router.get("", (req, res, next) => {
  res.send({
    companies: Company.find({})
  })
})

module.exports = router;
