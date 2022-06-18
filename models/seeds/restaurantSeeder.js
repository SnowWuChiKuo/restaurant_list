const bcrypt = require('bcryptjs')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const db = require('../../config/mongoose')
const User = require('../user')
const Restaurant = require('../restaurant')
const restaurantList = require('../../restaurant.json').results
// 引用資料夾內部的資料庫進行使用

const SEED_USERS = [
  {
    email: 'user1@example.com',
    password: '12345678',
    restaurants: restaurantList.slice(0, 3)
  },
  {
    email: 'user2@example.com',
    password: '12345678',
    restaurants: restaurantList.slice(3, 6)
  }
]

db.once('open', () => {
  Promise.all(Array.from(SEED_USERS, seed_user => {
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(seed_user.password, salt))
      .then(hash => User.create({
        email: seed_user.email,
        password: hash
      }))
      .then(user => {
        const userId = user._id
        seed_user.restaurants.forEach(item => {
          item.userId = userId
        })
        return Restaurant.create(seed_user.restaurants)
      })
  }))
    .then(() => {
      console.log('done!')
      process.exit()
    })
    .catch(error => console.log(error))
})