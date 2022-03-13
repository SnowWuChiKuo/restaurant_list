const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

// routes setting 首頁
router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurantsData => res.render('index', { restaurantsData }))
    .catch(error => console.log(error))
})

module.exports = router