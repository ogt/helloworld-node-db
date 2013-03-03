require('./u.js')
require('./nodeutil.js')

_.run(function () {

	var express = require('express');
	var app = express();

	app.use(express.logger('dev'));
	app.use(express.favicon('public/favicon.ico'));
	app.use(express.static(__dirname + '/public'));
	app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
	app.use(express.cookieParser())
	app.use(function (req, res, next) {
		_.run(function () {
			req.body = _.consume(req)
		    next()
		})
	})


	app.get('/', function (req, res) {
	    res.sendfile('./index.html')
	});


	var fields = ['username','firstname','lastname']
	app.all('/rpc', require('./rpc.js')({
		getVersion : function () {
			return 1
		},

		register : function (arg, req, res) {
			fields.forEach( function(field) {
			    res.cookie(field, arg[field]);
			})
			return true;
		},

		logout : function(arg, req, res) {
			fields.forEach( function(field) {
				res.clearCookie(field)
			})
			return true;
		},

		getUser : function (arg, req, res) {
			var userInfo = {}
			fields.forEach( function(field) {
				userInfo[field] = req.cookies[field]
			})
			return userInfo
		}
	}))

	app.listen(process.env.PORT, function() {
		console.log("go to " + process.env.HOST)
	})
})