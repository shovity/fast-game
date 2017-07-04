const io = require('socket.io')(),
	quests = require('./datas/quest')

var currentQuest = null,
	users = []

io.on('connection', (socket) => {

	console.log(`${socket.id} connected`)
	socket.emit('who are you')

	// update
	socket.on('update', (data) => {
		var p = users.findIndex(user => user.username == data.username)

		// New user
		if (p == -1) {
			socket.username = data.username
			console.log(`${socket.username}-${socket.id} logined`)
			users.push({
				username: data.username,
				point: data.point,
				id: socket.id,
				token: data.token
			})
		} else {
			// exist
			users[p].point = data.point
		}

		socket.broadcast.emit('update', users)
	})

	// Get update
	socket.on('get update', () => {
		socket.emit('update', users)
	})

	// Master start a quest
	socket.on('start', (num) => {
		var quest = quests[num]
		currentQuest = quest
		if (num > -1 && num < quests.length) {
			io.emit('start', quest)
			console.log(`Master start quest ${num}`)
		} else {
			console.log(`Erro quest number ${num} - ( quest > -1 && quest < ${quests.length})`)
		}
	})

	// End quest
	socket.on('end', () => {
		io.emit('end', currentQuest.true)
	})

	// Check username
	socket.on('check username', (username) => {
		var result = users.findIndex(user => user.username == username) == -1
		socket.emit('check username', result)
	})

	// Check token
	socket.on('check token', (token) => {
		var result = users.findIndex(user => user.token == token) == -1
		socket.emit('check token', result)
	})

	// Mesage master
	socket.on('meg master', (data) => {
		socket.broadcast.emit('meg master', data)
	})

	// To master
	socket.on('to master', (data) => {
		socket.broadcast.emit('to master', data)
	})

	// User disconnect
	socket.on('disconnect', () => {
		var p = users.findIndex(user => user.username == socket.username)
		if (p != -1) {
			users.splice(p, 1)
			socket.broadcast.emit('update', users)
			console.log(`${socket.username}-${socket.id} logouted`)
		} else {
			console.log(`${socket.id} disconnected`)
		}
	})
})

module.exports = io