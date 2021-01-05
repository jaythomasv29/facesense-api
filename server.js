const { response } = require('express')
const express = require('express')
const bcrypt = require('bcrypt-nodejs')
const app = express() // new run of express
const PORT = 3000

app.use(express.urlencoded({extended:false})) // middleware to parse body

const database = {
  users: [
    {
      id: 1,
      name: 'james',
      email: 'james@gmail.com',
      password: 123123,
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
  ],
  login: [

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
  res.send('Hello World')
})

// signin route for posting to server and authenticate
app.post('/signin', (req, res) => {
  bcrypt.compare("123123", "$2a$10$aG9CEZrBbtpg9KIwKm9ZUO3tRzBu.c.F7LSYYJk5hiDXGYcdJIY3e", (err, res) => {
    console.log('guess', res)
  })

  bcrypt.compare("1231233", "$2a$10$aG9CEZrBbtpg9KIwKm9ZUO3tRzBu.c.F7LSYYJk5hiDXGYcdJIY3e", (err, res) => {
    console.log('guess', res)
  })
  // authenticate user
  if (req.body.email === database.users.email && req.body.password === database.users.password){
    res.send('you are signed in')
  } else {
    // res.send('authentication failed')
    res.status(400).json('error logging in')
  }
})
app.post('/register', (req, res) => {
  // get information from user
  //database.users.push
  const newId = database.users.length
  const { name, email, password } = req.body
    
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
    console.log(database)
  res.json("Added successfully")
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



/*
'/' root route to
/signin POST request to send data and authenticate
  * POST = success/fail
/register POST = send data to database to save new user
/profile:userId = GET request of user information and return the user dashboard
/image => Put --> user

*/