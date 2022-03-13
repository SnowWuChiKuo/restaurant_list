// require packages and used in the project
const express = require('express')
const mongoose = require('mongoose')
// require express-handlebars here
const exphbs = require('express-handlebars')

const bodyParser = require('body-parser')
const methodOverride = require('method-override')
// require restaurant.json
const restaurantsData = require('./restaurant.json').results

// require restaurant.js
const Restaurant = require('./models/restaurant')

const app = express()
const port = 3000

mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true, })
// 取的資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))


// routes setting 首頁
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurantsData => res.render('index', { restaurantsData }))
    .catch(error => console.log(error))
})
// 新增餐廳
app.get('/restaurants/new', (req,res) => {
  return res.render('new')
})

app.post('/restaurants', (req,res) => {
  return Restaurant.create(req.body)   // 存入資料庫
    .then(() => res.redirect('/'))     // 新增完成導回首頁
    .catch(error => console.log(error))
})
// 瀏覽特定餐廳
app.get('/restaurants/:restaurant_id', (req, res) => {
  const { restaurant_id } = req.params
  Restaurant.findById(restaurant_id)
    .lean()
    .then(restaurantData => res.render('show', { restaurantData }))
    .catch(error => console.log(error))
})
// 編輯餐廳頁面
app.get('/restaurants/:restaurant_id/edit', (req, res) => {
  const { restaurant_id } = req.params
  Restaurant.findById(restaurant_id)
    .lean()
    .then(restaurantData => res.render('edit', { restaurantData }))
    .catch(error => console.log(error))
})

app.put('/restaurants/:id', (req, res) => {
  const  restaurant_id  = req.params.id
  return Restaurant.findById(restaurant_id)
    .then(restaurantsData => { 
      return restaurantsData.update(req.body) 
    })
    .then(() => res.redirect(`/restaurants/${restaurant_id}`))
    .catch(error => console.log(error))
})

// 刪除餐廳
app.delete('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// searchbar setting 搜尋餐廳
app.get("/search", (req, res) => {
  // if (!req.query.keywords) {
  //   res.redirect("/")
  // }

  const keywords = req.query.keywords
  const keyword = req.query.keywords.trim().toLowerCase()

  const restaurants = restaurantsData.filter(
    data =>
      data.name.toLowerCase().includes(keyword) ||
      data.category.includes(keyword)
  )

  res.render('index', { restaurants, keywords })
})


// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})