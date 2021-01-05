const express = require('express')
const app = express() // new run of express
const PORT = 3000

app.get('/', (req, res) => {
  res.send('Hello World')
})

// signin route for posting to server and authenticate
app.post('/signin', (req, res) => {
  res.send('you are signed in')
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