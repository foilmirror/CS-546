const mainRoutes = require('./main');
const postRoutes = require('./posts');
const searchRoutes = require('./search');
const userRoutes = require('./users');
const path = require('path');

const constructorMethod = (app) => {
    app.use('/post', postRoutes);
	app.use('/users', userRoutes);
	app.get('/about', (req, res) => {
		res.sendFile(path.resolve('static/about.html'));
	});

	app.use('*', (req, res) => {
		res.redirect('/about');
	});
};

module.exports = constructorMethod;
