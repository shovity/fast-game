document.addEventListener('DOMContentLoaded', () => {
	var socket = io(),
		username = getCookie('username'),
		timeOut = 60,
		isPlay = false,
	isEnded = true

	// Sound
	var inPlayAudio = new Audio('/mp3/time.mp3'),
		endAudio = new Audio('/mp3/end.mp3')

	inPlayAudio.load()
	endAudio.load()

	socket.emit('get update')

	start.addEventListener('click', () => {
		if (questNum.value == '') {
			alert('Câu hỏi không được trống')
			return
		}

		if (isPlay) {
			alert('Chưa hết thời gian')
		} else {
			var q = parseInt(questNum.value) - 1;
			if (q < 0 || q > max-1) {
				alert('Câu hỏi không hợp lệ')
			} else {
				isEnded = false
				inPlayAudio.currentTime = 0
				inPlayAudio.play()
				socket.emit('start', q)
			}
		}
	})

	end.addEventListener('click', () => {
		if (isEnded) {
			alert('Chỉ được hiện đáp án 1 lần sau khi hết thời gian')
		} else {
			if (isPlay) {
				alert('Chưa hết thời gian')
			} else {
				isEnded = true
				endAudio.currentTime = 0
				endAudio.play()
				socket.emit('end')
			}
		}
	})

	socket.on('update', (users) => {
		users.sort( (a, b) => parseInt(a.point) < parseInt(b.point))
		listUsers.innerHTML = '<th>BXH</th><th>Tên người chơi</th><th>Điểm</th>'
		users.forEach((user, i) => {
			listUsers.innerHTML += `<tr>
				<td>${i+1}</td>
				<td>${user.username}</td>
				<td>${user.point}</td>
			</tr>`
		})
	})

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
		chatMeg.innerHTML += '<p><strong>' + username + '</strong>: ' +  meg.value + '</p>'
		chatContent.scrollTop = chatContent.scrollHeight;
		socket.emit('meg master', { username, meg: meg.value })
		meg.value = ''
	})

	reset.addEventListener('click', () => {
		socket.emit('reset point')
	})

	meg.addEventListener('keyup', (e) => {
		if (e.keyCode == 13) {
			send.click()
		}
	})

	socket.on('to master', (data) => {
		chatMeg.innerHTML += '<p><strong>' + data.username + '</strong>: ' + data.meg + '</p>'
		meg.value = ''
		chatContent.scrollTop = chatContent.scrollHeight;
	})

	socket.on('start', (quest) => {
		if (isPlay) {
			alert('Chưa hết thời gian')
		} else {
			var	timeIt = setInterval(tick, 1000)
			var time = timeOut

			isPlay = true;

			tick()
			questBox.innerHTML = quest.content

			a.innerHTML = 'A: ' + quest.a
			b.innerHTML = 'B: ' + quest.b
			c.innerHTML = 'C: ' + quest.c
			d.innerHTML = 'D: ' + quest.d

			function tick() {
				statTime.innerHTML = time + 's';

				if (time-- <= 0) {
					isPlay = false
					clearInterval(timeIt)
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
	})

	//--
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
