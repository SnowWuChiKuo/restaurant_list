const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

// 新增餐廳
router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', (req, res) => {
  return Restaurant.create(req.body)   // 存入資料庫
    .then(() => res.redirect('/'))     // 新增完成導回首頁
    .catch(error => console.log(error))
})
// 瀏覽特定餐廳
router.get('/:restaurant_id', (req, res) => {
  const { restaurant_id } = req.params
  Restaurant.findById(restaurant_id)
    .lean()
    .then(restaurantData => res.render('show', { restaurantData }))
    .catch(error => console.log(error))
})
// 編輯餐廳頁面
router.get('/:restaurant_id/edit', (req, res) => {
  const { restaurant_id } = req.params
  Restaurant.findById(restaurant_id)
    .lean()
    .then(restaurantData => res.render('edit', { restaurantData }))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const restaurant_id = req.params.id
  return Restaurant.findById(restaurant_id)
    .then(restaurantsData => {
      return restaurantsData.update(req.body)
    })
    .then(() => res.redirect(`/restaurants/${restaurant_id}`))
    .catch(error => console.log(error))
})

// 刪除餐廳
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


module.exports = router