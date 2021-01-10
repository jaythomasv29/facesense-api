const express = require('express')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const app = express() // new run of express
const PORT = 3001
const knex = require('knex')({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'jamesvongampai',
      password : '',
      database : 'smart-brain',
  }
})

knex.select('*').from('users').then(data => {
  console.log(data)
})

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
    return false
  }
}
app.get('/', (req, res) => {
  res.json(database)
})

// signin route for posting to server and authenticate
app.post('/signin', (req, res) => { 
  // authenticate user
 knex.select('email', 'hash').from('login')
 .where('email', '=', req.body.email)
 .then(data => {
   const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
   console.log(isValid)
   //check if password upon signin is valid
   if(isValid) {
     return knex.select('*').from('users')
     .where('email', '=', req.body.email)
     .then(user => {
       console.log(user)
       res.status(200).json(user[0])
     })
     .catch(err => res.status(400).json('unable to get user'))
   } else {  // else if the hash is not valid pw
     res.status(400).json('wrong credientials')
   }
 })
})

app.post('/register', (req, res) => {
  // get information from user from body
  const { name, email, password } = req.body
  const hash = bcrypt.hashSync(password)
  knex.transaction(trx => {
    //update login table
    trx.insert({
      hash: hash,
      email: email
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      return trx('users')
        // insert user into database
        .returning('*')
        .insert({
          name: loginEmail[0],
          email: email,
          joined: new Date()
        }).then(user => {
          // a promise to handle the success
          res.json(user[0])
        })  
    })
    .then(trx.commit)
    .catch(trx.rollback)
  })
  .catch(err => res.status(400).json('unable to register'))
})

//get user by looping through 'database'
app.get('/profile/:id', (req, res) => {
  const { id } = req.params
  knex.select('*').from('users').where('id', id)
  .then(user => {
    if(user.length){
      console.log(user[0])
      res.json(user[0])
    } else {
      res.status(400).json('user not found')
    }
  })
  .catch(err => res.status(400).json('error getting user'))
 
})

//find the id of user 
app.put('/image', (req, res) => {
  // console.log(database)
  const { id } = req.body // get id from parsing body
// update entries and increase the count
knex('users')
  .where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    console.log(entries)
    res.json(entries[0])
  })
  .catch(err => res.status(400).json("error in updating entries"))
})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
