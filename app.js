// require packages and used in the project
const express = require('express')
const mongoose = require('mongoose')
// require express-handlebars here
const exphbs = require('express-handlebars')

const bodyParser = require('body-parser')
// require restaurant.json
const restaurantsData = require('./restaurant.json').results

// require restaurant.js
const Restaurant = require('./models/restaurant')

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true }))


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
// 顯示餐廳詳細資料
app.get('/restaurants/:restaurant_id', (req, res) => {
  const { restaurant_id } = req.params
  const restaurantData = restaurantsData.find(restaurant => restaurant.id === Number(restaurant_id))
  res.render('show', { restaurantData })
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