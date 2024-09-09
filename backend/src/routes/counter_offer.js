const { Router } = require("express");
const verifyToken = require('./validate-token')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const CounterOffer = require("../models/counter_offer")

const router = Router()

router.use(cookieParser())
router.post("/register", verifyToken, async (req, res, next) => {

  const { description, offerId, price } = req.body
  const token = jwt.decode(req.cookies.jwt)
  const { id, company_id } = token

  const newCounterOffer = new CounterOffer({
    description,
    offer_id: offerId,
    buyer: id,
    company_buyer: company_id,
    price
  })

  await newCounterOffer.save()

  res.status(201).send()
})

module.exports = router
