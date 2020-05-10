const express = require('express');
const session = require('express-session');
const app = express();
const static = express.static(__dirname + '/public');

const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');



app.use(session({
    name: 'AuthCookie',
    secret: 'some secret string!',
    resave: false,
    saveUninitialized: true
}))
  
app.use(async (req, res, next) => {
	if (!req.session.user) {
		console.log("[" + new Date().toUTCString() + "]: " + req.method + " to " + req.originalUrl + " (Not logged in)");
		next();
	}
	else {
		console.log("[" + new Date().toUTCString() + "]: " + req.method + " to " + req.originalUrl + " (Logged in as " + req.session.user._id + ")");
		next();
	}
});

app.use('/', async (req, res, next) => {
	if (req.url == '/' && !req.session.user) {
    	return res.redirect('/users/login');
	} else {
    next();
  }
});

 
configRoutes(app);

app.listen(3000, () => {
	console.log("We've now got a server!");
	console.log('Your routes will be running on http://localhost:3000');
});
