<<<<<<< HEAD
const mainRoutes = require('./main');
const postRoutes = require('./posts');
const searchRoutes = require('./search');
=======
const postRoutes = require('./posts');
>>>>>>> 3502ad965c7b77bd338e42fbdcf64f628fe28889
const userRoutes = require('./users');
const path = require('path');

const constructorMethod = (app) => {
<<<<<<< HEAD
    app.use('/', mainRoutes);
    app.use('/post', postRoutes);
	app.use('/search', searchRoutes);
	app.use('/users', userRoutes);
	app.get('/about', (req, res) => {
		res.sendFile(path.resolve('static/about.html'));
	});

	app.use('*', (req, res) => {
		res.redirect('/about');
	});
};

module.exports = constructorMethod;
=======
	app.use('/posts', postRoutes);
	app.use('/users', userRoutes);
	

	app.use('*', (req, res) => {
		res.redirect('/posts');
	});
};

module.exports = constructorMethod;
>>>>>>> 3502ad965c7b77bd338e42fbdcf64f628fe28889
