const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
// 引用資料夾內部的資料庫進行使用
const restaurantList = require('../../restaurant.json').results

mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true, })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('running restaurantSeeder script...')
  // 運行創建資料庫內容
  Restaurant.create(restaurantList)
    .then(() => {
      // 資料庫載入結束並關閉
      console.log('restaurantSeeder done!')
      db.close()
    })
    .catch(error => console.log(error))
})

