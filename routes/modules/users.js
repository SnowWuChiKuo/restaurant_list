const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')

router.get('/login',(req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  // 先取得參數表
  const { name, email, password, confirmPassword } = req.body
  // 檢查是否有註冊過
  User.findOne({ email })
    .then(user => {
      // 如果註冊過: 退回 login 頁面
      if (user) {
        console.log('User already exists')
        res.render('register', {
          name,
          email,
          password,
          confirmPassword
        })
      } else {
        // 如果還沒註冊: 建立資料庫
        return User.create({
          name,
          email,
          password
        })
          .then(() => res.redirect('/'))
          .catch(error => console.log(error))
      }
    }) 
    .catch(error => console.log(error))
})


module.exports = router