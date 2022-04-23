const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

const sortOpt = [
  { val: 1, txt: 'A > Z', sort: 'name' },
  { val: 2, txt: 'Z > A', sort: '-name'}
]

// routes setting 首頁
router.get('/', (req, res) => {
  const userId = req.user._id
  Restaurant.find({ userId })
    .lean()
    .then(restaurantsData => res.render('index', { restaurantsData, sortOpt }))
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
        keywords
      })
    })
    .catch(err => console.log(err))
})

module.exports = router