const express = require('express')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const app = express() // new run of express
const PORT = 3001

app.use(cors())

app.use(express.json({
  type: ['application/json', 'text/plain']
}))

const database = {
  users: [
    {
      id: 1,
      name: 'james',
      email: 'james@gmail.com',
      password: "123123",
      entries: 0,
      joined: new Date(),
    },
    {
      id: 2,
      name: 'jim',
      email: 'jim@gmail.com',
      password: 123123,
      entries: 0,
      joined: new Date(),
    }
  ]
}
// function to get user
const getUser = (id) => {
  const found = database.users.filter(user => {
      return user.id == id
      })
  if (found.length == 1) {
    return found[0]
  } else {
    return 'user not found'
  }
}
app.get('/', (req, res) => {
  res.json(database)
})

// signin route for posting to server and authenticate
app.post('/signin', (req, res) => { 
  // authenticate user
  if (req.body.email == database.users[0].email && req.body.password == database.users[0].password){
    res.status(200).json("success")
  } else {
    // res.send('authentication failed')
    res.status(400).json('error logging in')
  }
})

app.post('/register', (req, res) => {
  const { name, email, password } = req.body
  // get information from user
  //database.users.push
  console.log(' at register route')
  console.log('name', name)
  const newId = database.users.length
  // hash password using bcrypt
  bcrypt.hash(password, null, null, (err, hash) => {
    console.log(hash)
  })
  
  const entries = 0
  const joined = new Date()
  database.users.push(
    {
      id: newId,
      name: name,
      email: email,
      password: password,
      entries: entries,
      joined: joined
    }
    )
    // console.log(database)
  res.json(database.users[database.users.length-1])
})

//get user by looping through 'database'
app.get('/profile/:id', (req, res) => {
  const { id } = req.params
  res.json(getUser(id))
})

//find the id of user 
app.put('/image', (req, res) => {
  // console.log(database)
  const { id } = req.body // get id from parsing body
  console.log(id)
  res.send(id)
  // res.json(getUser(1))
  
})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
