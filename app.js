// require packages and used in the project
const express = require('express')
const app = express()
const port = 3000

// require express-handlebars here
const exphbs = require('express-handlebars')

// require restaurant.json
const restaurantsData = require('./restaurant.json').results

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))

// routes setting 
app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantsData })
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

  const filterRestaurantsData = restaurantsData.filter(
    data =>
      data.name.toLowerCase().includes(keyword) ||
      data.category.includes(keyword)
  )

  res.render('index', { filterRestaurantsData, keywords })
})


// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})