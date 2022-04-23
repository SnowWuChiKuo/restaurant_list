const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')
const bcrypt = require('bcryptjs')

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
  const errors = [] 

  if (!name || !email || !password || !confirmPassword ) {
    errors.push({ message: '所有欄位都是必填!' })
  }

  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符' })
  }

  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }

  // 檢查是否有註冊過
  User.findOne({ email })
    .then(user => {
      // 如果註冊過: 退回 login 頁面
      if (user) {
        errors.push({ message: '這個Email已經註冊過了!' })
        return res.render('register', {
          errors,
          name,
          email,
          password,
          confirmPassword
        })
      }
      // 如果還沒註冊: 建立資料庫 & 加密
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({
          name,
          email,
          password: hash
        }))
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
    })
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出!')
  res.redirect('/users/login')
})

module.exports = router