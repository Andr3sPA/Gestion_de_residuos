const { Router } = require("express");
const verifyToken = require('./validate-token')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const Sale = require('../models/Sale')
const CounterOffer = require('../models/counter_offer')
const Offer = require('../models/offer')
const Waste = require('../models/waste')

const router = Router()

router.use(cookieParser())

router.post("/create", verifyToken, async (req, res, next) => {
  const { offerId, counterOfferId } = req.body
  const token = jwt.decode(req.cookies.jwt)

  const counterOffer = await CounterOffer.findById(counterOfferId)
  const offer = await Offer.findById(offerId)
  if (!counterOffer || !offer) {
    throw new Error("no offer or counterOffer")
  }

  await CounterOffer.updateMany({ offer_id: offer._id, _id: { $ne: counterOffer._id } }, { status: "rejected" })
  const waste = await Waste.findById(offer.waste)
  waste.quantity -= offer.quantity
  await waste.save()

  const sale = new Sale({
    offer_id: offerId,
    counter_offer_id: counterOfferId,
    price: counterOffer.price
  })

  counterOffer.status = "accepted"
  offer.status = "sold"

  await sale.save()
  await offer.save()
  await counterOffer.save()

  res.status(201).send()
})

module.exports = router
