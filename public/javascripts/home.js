document.addEventListener('DOMContentLoaded', () => {
	var socket = io(),
		alb = document.getElementById('al'),
		nameOk = false

	login.addEventListener('click', () => {
		if (token.value.length == 0) {
			al('Mã không được để trống', 'danger')
		} else {
			if (nameOk) {
				socket.emit('check token', token.value)
			} else {
				al('Hãy nhập tên hợp lệ', 'danger')
			}
		}
	})

	username.addEventListener('blur', () => {
		if (username.value.length < 3 || username.value.length > 12) {
			al('Tên phải có độ dài từ 3 đến 12 kí tự', 'danger')
		} else {
			socket.emit('check username', username.value)
		}
	})

	socket.on('check username', (result) => {
		if (result) {
			al('Tên có thế sử dụng', 'success')
			nameOk = true
		} else {
			al('Tên đã tồn tại', 'danger')
		}
	})

	socket.on('check token', (result) => {
		if (result) {
			submit.click()
		} else {
			al('Mã đang được sủ dụng', 'danger')
		}
	})

	function al(meg, type) {
		alb.innerHTML = '<div class="alert alert-' + type + '">' + meg + '</div>'
	}

	al('I hope you had fun <3', 'info')
})