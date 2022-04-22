// require packages and used in the project
const express = require('express')
// require session
const session = require('express-session')
// require express-handlebars here
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

// require restaurant.js
const routes = require('./routes')
require('./config/mongoose')

const app = express()
const port = 3000

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
// setting static files
app.use(session({
  secret: 'ThisIsMySecret', // 這參數是session驗證id的字串，不會洩漏給用戶端
  resave: false, // 若設定true,會在每一次使用者互動後，強制將 session 更新到 session store 裡
  saveUninitialized: true // 強制將為初始化的 session 存回 session store。未初始化表示這個 session 是新的沒有被修改過，例如未登入的使用者的session
}))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(routes)

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})