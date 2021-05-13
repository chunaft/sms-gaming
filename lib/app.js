require('dotenv').config();
const singlePlayerModeHandler = require('./mode-controllers/singleplayer');

const express = require('express');
const session = require('express-session');

const { singlePlayerWelcomeMsg, serverErrorMsg } = require('./messages');
const {
  sendMessage,
  saveUserSession,
  broadcastMessage,
  sessionConfig
} = require('./utils');

const app = express();
const PORT = process.env.PORT || 3000;



// Parse incoming Twilio request
app.use(express.urlencoded({ extended: false }));

// Session middleware
app.use(session(sessionConfig));

// Custom properties attached on each request & response
app.use((req, res, next) => {
  req.user = req.session.user;
  res.sendMessage = sendMessage(res);
  req.saveUserSession = saveUserSession(req);
  req.broadcastMessage = broadcastMessage(req);
  next();
});

// The main endpoint where messages arrive
app.post('/', async (req, res) => {
  const user = req.session.user || {};
  if (!req.user) {
    userSession = {
      phone: req.body.From,
    }
    await req.saveUserSession(userSession);
    req.user = userSession;
  }

  singlePlayerModeHandler(req, res);

});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
