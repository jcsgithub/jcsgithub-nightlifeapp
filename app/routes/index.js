'use strict';

var path = process.cwd();

module.exports = function (app, passport) {
	// Paths to import
	var BarHandler = require(path + '/app/controllers/barHandler.server.js');
	var UserHandler = require(path + '/app/controllers/userHandler.server.js');
	
	// Objects imported
	var barHandler = new BarHandler();
	var userHandler = new UserHandler();
	
	
	
	

    function isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/');
        }
    }

	function isAuthorized (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.sendStatus(401);
		}
	}





	/***** Public routes *****/
	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});
		
	app.route('/mybars')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/mybars.html');
		});

		
		
		

	/***** APIs *****/
    app.route('/api/user')
        .get(isAuthorized, function (req, res) {
        	var userData = {
        		_id: req.user._id,
				bars: req.user.bars,
				displayName: req.user.facebook.displayName
        	};
            res.json(userData);
        });
        
    app.route('/api/bars')
        .get(barHandler.searchBarByName);
    
    
    


	/***** Facebook authorization *****/
	app.route('/auth/facebook')
		.get(passport.authenticate('facebook'));

	app.route('/auth/facebook/callback')
		.get(passport.authenticate('facebook', {
			successRedirect: '/',
			failureRedirect: '/'
		}));
};
