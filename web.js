require('./u.js')
require('./nodeutil.js')

_u.run(function () {
    var db = require('mongojs').connect(process.env.MONGOLAB_URI, ['users'])
	var p = _u.promiseErr()
	var express = require('express');
	var app = express();

	app.use(express.logger('dev'));
	app.use(express.favicon('public/favicon.ico'));
	app.use(express.static(__dirname + '/public'));
	app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
	app.use(express.cookieParser())
	app.use(function (req, res, next) {
		_u.run(function () {
			req.body = _u.consume(req)
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
			var username = arg['username']
			var p = _u.promiseErr()
			db.users.find({ username : username}, p.set)
			users = p.get()
			if (_u.size(users) >0 ) {
				return [false, 'There is already a user named "'+username+'" : '+JSON.stringify(users)];
			}
			userinfo = fields.map(function(el) { return arg[el] })
			db.users.save(userinfo, p.set); 

			res.cookie('username', username);
			return [true];
		},

		logout : function(arg, req, res) {
			fields.forEach( function(field) {
				res.clearCookie(field)
			})
			return true;
		},

		getUser : function (arg, req, res) {
			var username = req.cookies['username']
			if (!username) {
				return {};
			}
			var p = _u.promiseErr()			
			if (db.users) {
				db.users.find({ username : username}, p.set)
			}
			users = p.get()
			if (!users) {
				throw('User "'+username+'"  is not registered');
			}
			return users[0]
		}
	}))

	app.listen(process.env.PORT, function() {
		console.log("go to " + process.env.HOST)
	})
})