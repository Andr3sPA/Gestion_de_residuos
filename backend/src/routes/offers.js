const { Router } = require("express");
const verifyToken = require('./validate-token')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const Offer = require("../models/offer")
const Waste = require("../models/waste")

const router = Router()

router.use(cookieParser())

router.post("/register", verifyToken, async (req, res, next) => {

  const { description, wasteId, quantity, price } = req.body
  const token = jwt.decode(req.cookies.jwt)
  const { id, company_id } = token

  const waste = await Waste.findById(wasteId)
  if (!waste) {
    res.status(400).send("waste does not exist")
  }

  //TODO: check all offers for available quantity

  const newOffer = new Offer({
    description,
    seller: id,
    company_seller: company_id,
    quantity,
    price
  })

  await newOffer.save()

  res.status(201).send()
})

module.exports = router
