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

router.get('/search', (req, res) => {
  if (!req.query.keywords) {
    res.redirect('/')
  }

  const keywords = req.query.keywords
  const keyword = req.query.keywords.trim().toLowerCase()

  Restaurant.find({})
    .lean()
    .then(restaurantsData => {
      const filterRestaurantsData = restaurantsData.filter(
        data =>
          data.name.toLowerCase().includes(keyword) ||
          data.category.includes(keyword)
      )
      res.render('index', {
        restaurantsData: filterRestaurantsData,
        keywords,
      })
    })
    .catch(err => console.log(err))
})

module.exports = router