const { Pool } = require('pg');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const PORT = process.env.PORT || 3333;
let { models } = require('./models/index.js');
const { v4 } = require('uuid');

const routes = require('./routes/index.js');

const pool = new Pool({
  host: "localhost",
  user: "mesa20",
  database: "top_users",
  password: "mesa20",
  port: 5432,
})

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use((req, res, next) => {
  req.context = {
    models,
    me: models.users[1],
  }
  next();
})
app.use('/session', routes.session);
app.use('/users', routes.user);
app.use('/messages', routes.message);

// Home
app.get('/', (req, res) => {
  return res.send('Recieved a GET HTTP method');
})
app.post('/', (req, res)=> {
  return res.send('Recieved a POST HTTP method');
})
app.put('/', (req,res) => {
  return res.send('Recieved a PUT HTTP method');
})
app.delete('/', (req, res) => {
  return res.send('Recieved a DELETE HTTP method');
})

// Users
app.get('/users', (req, res) => {
  return res.send(Object.values(users));
});
app.get('/users/:id', (req, res) => {
  return res.send(users[req.params.id]);
});
app.post('/users', (req, res) => {
  return res.send('POST HTTP method on user resource');
});
app.put('/users/:id', (req, res) => {
  return res.send(`PUT HTTP method on user/${req.params.id} resource`);
});
app.delete('/users/:id', (req, res) => {
  return res.send(`DELETE HTTP method on user/${req.params.id} resource`);
});

// Messages
app.get('/messages', (req, res) => {
  return res.send(Object.values(messages));
});
app.get('/messages/:messageId', (req, res) => {
  return res.send(messages.req.params.messageId);
});
app.post('/messages', (req, res) => {
  const id = v4();
  const message = {
    id,
    text: req.body.text,
    userId: req.me.id,
  };

  messages[id] = message;

  return res.send(message);
});
app.delete('/messages/:messageId', (req, res) => {
  const {
    [req.params.messageId]: message,
    ...otherMessages
  } = messages;

  messages = otherMessages;

  return res.send(message);
});
app.put('/messages/:messageId', (req, res) => {
  let editedMessage = messages[req.params.messageId];
  editedMessage.text = req.body.text;
  return res.send(editedMessage);
});

app.listen(PORT, () =>  console.log(`Express app listening on port ${PORT}`));
