const token = require('./datas/token')

function master(req, res, next) {
	if (req.cookies.token != token[0]) {
		res.end('Permision denie! Only master')
	} else {
		next()
	}
}

function client(req, res, next) {
	if (token.indexOf(req.cookies.token) == -1) {
		res.redirect('/')
	} else {
		next()
	}
}

module.exports = { master, client }