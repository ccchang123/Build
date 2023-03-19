ctl = true;
(function() {
	var num = 450
	var speed= 40
	$(document).ready(() => {
		var html_body = $("body")
		var html_width = $(document).width()
		var win_height = $(window).height()
		var scroll_top = 0
		var h = 0
		$(document).mousemove((e) => {
			h = e.clientX - html_width / 2
		})
		function snow() {
			var css_top = -10 + scroll_top
			var css_left = Math.random()*99
			var thisSnow = $("<div></div>")
			thisSnow.css({
				"z-index": "10",
				"height": "10px",
				"width": "10px",
				"color": "white",
				"font-size": 10 + Math.random() * 6.7 + "px",
				"position": "fixed",
				"top": css_top,
				"left": css_left+"%",
				"transform": "rotate(" + Math.random() * 360 + "deg)"
			})
			item = ['❄', '🎄', '❅', '❆', '☃️', '⛄️', '❄', '❅', '❆', '❄', '❅', '❆', '❄', '❅', '❆']
			rand = Math.floor(Math.random() * item.length)
			thisSnow.append(item[rand])
			html_body.append(thisSnow)
			var time = setInterval(() => {
				if (ctl) {
					thisSnow.css("top", css_top = css_top + 0.9)
					thisSnow.css("left", (css_left = (css_left+h/35000)) + "%")
					if(css_left > 99){
						css_left = css_left - 99
					}
					if(css_left < 0){
						css_left = css_left + 99
					}
					if(css_top > (win_height+scroll_top)){
						clearInterval(time)
						thisSnow.remove()
					}
				}
			},speed)
		}

		setInterval(() => {
			if (ctl) {
				snow();
			}
		},num)
	})
})()

window.onblur = () => {
	ctl = false
};

window.onfocus = () => {
	ctl = true
};

