const express = require('express'),
	middleware = require('../middleware'),
	token = require('../datas/token'),
	quest = require('../datas/quest')

const router = express.Router(),
	maxAge = 24 * 60 * 60 * 1000

router.get('/', (req, res, next) => {
	if (req.cookies.token != undefined) {
		var p = token.indexOf(req.cookies.token)
		if (p == 0) {
			res.redirect('/master')
		} else if (p > 0){
			res.redirect('/client')
		} else {
			res.render('home', { title: 'Home' })
		}
	} else {
  	res.render('home', { title: 'Home' })
	}
})

router.post('/', (req, res, next) => {
	var username = req.body.username,
		tk = req.body.token

	if (username.length == 0) {
		res.render('home', { title: 'Home', error: 'Tên hiển thị không được trống' })
	} else if (token.indexOf(tk) != -1) {
		res.cookie('username', username, { maxAge })
		res.cookie('token', tk, { maxAge })

		var point = Math.random().toString(36).substr(2, 3) + 0 + Math.random().toString(36).substr(2, 4);
		res.cookie('point', point, { maxAge })

		// Check master
		if (tk == token[0]) {
			res.redirect('/master')
		} else {
			res.redirect('/client')
		}
	} else {
		res.render('home', { title: 'Home', error: 'Sai Mã'})
	}

})

router.get('/set/:username/:point', (req, res, next) => {
	res.cookie('username', req.params.username, { maxAge })
	res.cookie('point', req.params.point, { maxAge })
	res.end('ok')
})

router.get('/o', (req, res, next) => {
	res.cookie('username', req.params.username, { maxAge: -1 })
	res.cookie('token', req.params.token, { maxAge: -1 })
	res.cookie('point', req.params.point, { maxAge: -1 })
	res.redirect('/')
})

router.use(middleware.client)

router.get('/master', middleware.master, (req, res, next) => {
	res.render('master', { title: "Master", quest })
})

router.get('/client', (req, res, next) => {
	res.render('client', { title: 'Client', name: 'Huong' })
})

module.exports = router
