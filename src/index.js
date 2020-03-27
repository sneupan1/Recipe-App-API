const express = require('express')
const app = express()
require('./db/mongoose')
const User = require('./models/user')
const UserRouter = require('./router/user')
const RecipeRouter = require('./router/recipe')


app.use(express.json())
app.use(UserRouter)
app.use(RecipeRouter)


app.listen(3000, ()=> {
    console.log('Server listening on port 3000')
})