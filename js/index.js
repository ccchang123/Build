scr = 0
document.addEventListener("DOMContentLoaded", () => {
    console.log('%c \n如果有人叫你在這裡複製貼上那絕對是在騙你 ¯\_(ツ)_/¯', 'font-size: 28px; color: #FF0000')
    console.log('%c \n如果你知道你在幹嘛, 歡迎加入我們 \\(.D˙)/', 'font-size: 23px')
    console.log('%c \nCopyright © 2022 CHANG, YU-HSI. All rights reserved.', 'color: rgba(237, 237, 237, 0.5)')
	show_rank()
	rank()
});

document.oncontextmenu = () => {
    return false
};

document.oncopy = () => {
    return false
}

document.onpaste = () => {
    return false
};

document.oncut = () => {
    return false
};

document.onkeypress = () => {
	scr = 0
};

document.onkeyup = () => {
    if (event.key == 'PrintScreen') {
        setTimeout(() => {
            alert('提醒您\n比賽圖片僅限使用於此網站，請勿盜用')
        }, '200');
    }
    if (event.key == 'Shift') {
		scr += 1
	}
    if (event.key == 'Meta') {
		scr += 10
	}
    if (event.key == 's' || event.key == 'S') {
		scr += 100
	}
	if (scr == 111) {
		setTimeout(() => {
            alert('提醒您\n比賽圖片僅限使用於此網站，請勿盜用')
        }, '200')
		scr = 0
	}
};

function comfirm_submit() {
	option = document.getElementsByName('support')[0].value
    if (option == '請選擇...') {
        alert('請選擇想要支持的人')
        return false
    }
    else {
        let check = confirm(`確定投票給 ${option} ?\n此動作無法取消`)
        if (check) {
            return true
        }
        else {
            return false
        }
    }
};

function confirm_SingUp() {
    option = document.getElementsByName('minecraft_id')[0].value
    let check = confirm(`您的ID是 ${option} \n確定報名此活動?`)
    if (check) {
        return true
    }
    else {
        return false
    }
};

function move_to_top() {
    if (window.scrollTo) {
        window.scrollTo({'behavior': 'smooth', 'top': 0})
    }
};

function counter() {
    let word = document.getElementsByName('msg')[0].value
    document.getElementById('word_counter').innerText = word.length
};

function check_value() {
    id = document.querySelector("#vote_form form input[type='text']").value
    button = document.querySelector("#vote_form form input[type='submit']")
	if (id == '') {
		button.style.cursor = "not-allowed"
	}
	else {
		button.style.cursor = "pointer"
	}
}

function show_notice() {
    var item = document.querySelector('.notice')
    item.style.display = "flex"
};

function unshow_notice() {
    var item = document.querySelector('.notice')
    item.style.display = "none"
};

function show_rank() {
    var item = document.querySelector('.show_rank')
    item.style.display = "flex"
};

function unshow_rank() {
    var item = document.querySelector('.show_rank')
    item.style.display = "none"
};

function rank() {
    list = []
    let item = document.getElementsByClassName('vote_list')
    for (i of item) {
        j = i.querySelector('.rank')
		div_height = i.querySelector('div').clientHeight
        img_height = i.querySelector('img').height
        if (img_height > div_height) {
            i.querySelector('div').style.height = `${img_height}px`
        }
        list.push(parseInt(j.innerText))
    }
    list = list.sort((a, b) => {
        return b - a;
    })
    for (let rank = 0; rank < 3; rank++) {
        max = Math.max(...list)
        for (i of item) {
            j = i.querySelector('.rank')
            var img = document.createElement('img');
            if (parseInt(j.innerText) == max) {
                switch (rank) {
                    case 0:
                        i.classList.add('first')
                        img.src = 'assets/res/gold.png'
                        break
                    case 1:
                        i.classList.add('secand')
                        img.src = 'assets/res/silver.png'
                        break
                    case 2:
                        img.src = 'assets/res/copper.png'
                        i.classList.add('third')
                        break
                }
                img.setAttribute('class', 'rank_img')
                i.appendChild(img)
                list.shift()
            }
        }
    }
};

let word = ''
sound = new Audio('assets/music/We Wish You a Merry Christmas.mp3')
document.onkeydown = (key) => {
    if (key.key == 'Enter') {
        if (word == 'xmas') {
            sound.play()
        }
        word = ''
    }
    else if (key.key == 'Escape') {
        sound.pause();
        sound.currentTime = 0;
    }
    else {
        word += key.key
    }
};
