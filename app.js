// require packages and used in the project
const express = require('express')
const mongoose = require('mongoose')
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

// require express-handlebars here
const exphbs = require('express-handlebars')

// require restaurant.json
const restaurantsData = require('./restaurant.json').results

// require restaurant.js
const Restaurant = require('./models/restaurant')

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))

// routes setting 
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurantsData => res.render('index', { restaurantsData }))
    .catch(error => console.log(error))
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  const { restaurant_id } = req.params
  const restaurantData = restaurantsData.find(restaurant => restaurant.id === Number(restaurant_id))
  res.render('show', { restaurantData })
})

// searchbar setting
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
  console.log(`Express is listening on localhost:${port}`)
})