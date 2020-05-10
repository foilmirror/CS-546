const mainRoutes = require('./main');
const postRoutes = require('./posts');
const searchRoutes = require('./search');
const userRoutes = require('./users');
const path = require('path');
const methodOverride = require('method-override');


const constructorMethod = (app) => {
	app.use(methodOverride('_method'));
	app.use('/', mainRoutes);
	app.use('/post', postRoutes);
	//app.use('/search', searchRoutes);
	app.use('/users', userRoutes);
	app.get('/about', (req, res) => {
		res.sendFile(path.resolve('static/about.html'));
	});

	app.use('*', (req, res) => {
		res.redirect('/about');
	});
};

module.exports = constructorMethod;
