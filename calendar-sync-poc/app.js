var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var pages = require('./pages'); // HTML page templates
var authHelper = require('./authHelper');
var graphHelper = require('./graphHelper');

// Configure express
app.use('/styles', express.static('styles'));
app.use(express.static('static'));
app.use(express.urlencoded({ extended: true }));  // For handling form submissions
app.use(bodyParser.json());
// Set up cookies and sessions to save tokens
app.use(cookieParser());
app.use(session(
  { secret: 'c397fc23-b5c7-4700-b3c1-188c08d71c87',
    resave: false,
    saveUninitialized: false 
  }));


// Login page
app.get('/', function(req, res) {
  res.send(pages.loginPage(authHelper.getAuthUrl()));
});

app.get('/authorize', function(req, res) {
  var auth_code = req.query.code;
  if(auth_code) {
    console.log(``);
    console.log('Authorization code:', auth_code);
    authHelper.getTokenFromCode(auth_code, tokenReceived, req, res);
  }
  else {
    console.log("/authorize called without a code parameter, redirecting to login");
    res.redirect('/');
  }
});

function tokenReceived(req, res, error, token) {
  if (error) {
    console.log('Access token error: ', error.message);
    res.send(pages.errorPage('Error getting token', error));
  } else {
    req.session.access_token = token.token.access_token;
    req.session.refresh_token = token.token.refresh_token;
    req.session.email = authHelper.getEmailFromIdToken(token.token.id_token);
    res.redirect('/home');
  }
}


app.get('/home', async (req, res) => {
  try {
    const userEmail = req.session.email;
    const events = await graphHelper.getEvents(req.session.access_token);
    res.send(pages.homePage(userEmail, events));
  } catch (error) {
    res.send(pages.errorPage('Failed to fetch events', error));
  }
});

app.get('/refreshtokens', function(req, res) {
  var refresh_token = req.session.refresh_token;
  if (refresh_token === undefined) {
    console.log("/refreshtokens called without a refresh token, redirecting to login");
    res.redirect('/');
    return;
  }
  authHelper.getTokenFromRefreshToken(refresh_token, tokenReceived, req, res);
});

app.get('/logout', function(req, res) {
  req.session.destroy()
  res.redirect('/');
});

app.get('/events', async function(req, res) {
  const accessToken = req.session.access_token;
  if (!accessToken) {
    console.log("No access token found, redirecting to login");
    return res.redirect('/');
  }
  try {
    const events = await graphHelper.getEvents(accessToken);
    res.send(pages.eventsPage(events));
  } catch (err) {
    res.send(pages.errorPage('Error fetching events', err));
  }
});

app.get('/addevent', (req, res) => {
  // Render the page with the form for adding a new event
  res.send(pages.addEventPage());
});

app.post('/addevent', async function(req, res) {
  const accessToken = req.session.access_token;
  if (!accessToken) {
    console.log("No access token found, redirecting to login");
    return res.redirect('/');
  }

  const startTime = new Date(req.body.startTime).toISOString();
  const endTime = new Date(req.body.endTime).toISOString();

  const eventDetails = {
    subject: req.body.subject,
    start: {
      dateTime: startTime,
      timeZone: 'UTC'
    },
    end: {
      dateTime: endTime,
      timeZone: 'UTC'
    }
  };

  try {
    const newEvent = await graphHelper.createEvent(accessToken, eventDetails);
    res.send(pages.eventCreatedPage(newEvent));
  } catch (err) {
    res.send(pages.errorPage('Error creating event', err));
  }
});

var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;
  
  console.log('App listening at http://%s:%s', host, port);
});