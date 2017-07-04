document.addEventListener('DOMContentLoaded', () => {
	
	// Config
	const timeOut = 30 // s
		
	var	isPlay = false,
		answerFocus = '',
		myAnswer = '',
		hPoint = getCookie('point'),
		point = Number.parseInt(hPoint.substr(3, hPoint.length - 7), 36)
		username = getCookie('username'),
		token = getCookie('token'),
		time = 0,
		addPoint = 0;

	statName.innerHTML = username
	statPoint.innerHTML = 'Điểm: ' + point

	socket = io();

	// Answer box
	for (let i = 0; i < 4; i++) {
		let btn = document.getElementById(String.fromCharCode(97 + i))

		btn.addEventListener('click', () => {
			if (isPlay) {
				refreshAnserBg()
				if (answerFocus != btn.id) {
					answerFocus = btn.id
					btn.className = 'answer focus'
				} else {
					isPlay = false
					btn.className = 'answer active'
					myAnswer = btn.id
					addPoint = time + 1
					btn.innerHTML += ` (${addPoint}s)`
				}

			}
		})
	}


	// Chat
	var chatBoxOpen = false;

	chatAnchor.addEventListener('click', () => {
		if (chatBoxOpen) {
			chatBox.className = ''
			chatAnchor.className = 'glyphicon glyphicon-chevron-up'
			chatBoxOpen = false
		} else {
			chatBox.className = 'open'
			chatAnchor.className = 'glyphicon glyphicon-chevron-down open'
			chatBoxOpen = true
		}
	})

	send.addEventListener('click', () => {
		chatMeg.innerHTML += '<p><strong>' + username + '</strong>: ' + meg.value + '</p>'
		socket.emit('to master', { username, meg: meg.value })
		meg.value = ''
		chatContent.scrollTop = chatContent.scrollHeight;
	})

	meg.addEventListener('keyup', (e) => {
		if (e.keyCode == 13) {
			send.click()
			meg.value = ''
		}
	})

	socket.on('meg master', (data) => {
		if (data.meg[0] == '/') {
			if (data.meg.split(' ')[0] == '/' + username) {
				var newMeg = data.meg.substr(('/' + username).length)
				chatMeg.innerHTML += '<p><strong>' + data.username + '</strong>: ' + newMeg + '</p>'
				meg.value = ''
				chatContent.scrollTop = chatContent.scrollHeight;
			}
		} else {
			chatMeg.innerHTML += '<p><strong>' + data.username + '</strong>: ' + data.meg + '</p>'
			meg.value = ''
			chatContent.scrollTop = chatContent.scrollHeight;
		}
	})

	// Socket
	socket.on('start', (quest) => {
		if (isPlay) {
			//
		} else {
			var	timeIt = setInterval(tick, 1000)
		
			time = timeOut
			addPoint = 0
			answerFocus = ''

			tick()
			isPlay = true;
			questBox.innerHTML = quest.content

			refreshAnserBg();
			myAnswer = '';

			a.innerHTML = 'A: ' + quest.a
			b.innerHTML = 'B: ' + quest.b
			c.innerHTML = 'C: ' + quest.c
			d.innerHTML = 'D: ' + quest.d

			function tick() {
				statTime.innerHTML = time + 's';

			
				if (time-- <= 0) {
					clearInterval(timeIt)
					isPlay = false
					statTime.innerHTML = 'Hết giờ'
				}
			}
		}
	})

	socket.on('end', (result) => {
		for (let i = 0; i < 4; i++) {
			var id = String.fromCharCode(97 + i)
			if (id != result) {
				var content = document.getElementById(id).innerHTML;
				document.getElementById(id).innerHTML = `<strike>${content}</strike>`
			}
		}

		if (result == myAnswer) {
			point += addPoint;
			statPoint.innerHTML = 'Điểm: ' + point
			setCookie('point', Math.random().toString(36).substr(2, 3) + point.toString(36) + Math.random().toString(36).substr(2, 4), 1)
			socket.emit('update', { username, point })
		}
	})

	socket.on('who are you', () => {
		socket.emit('update', { username, point, token })
	})

	//--
	function refreshAnserBg() {
		a.className = 'answer'
		b.className = 'answer'
		c.className = 'answer'
		d.className = 'answer'
	}

	function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}

	function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
	}

	//--
})