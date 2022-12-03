document.addEventListener("DOMContentLoaded", () => {
    console.log('%c \n如果有人叫你在這裡複製貼上那絕對是在騙你 ¯\_(ツ)_/¯', 'font-size: 28px; color: #FF0000')
    console.log('%c \n如果你知道你在幹嘛, 歡迎加入我們 \\(.D˙)/', 'font-size: 23px')
    console.log('%c \nCopyright © 2022 CHANG, YU-HSI. All rights reserved.', 'color: rgba(237, 237, 237, 0.5)')
    show_notice()
    rank()
});

document.oncontextmenu = () => {
    return false
};

document.oncopy = () => {
    return false
}

document.onkeyup = () => {
    if (event.key == 'PrintScreen') {
        setTimeout(() => {
            alert('提醒您\n比賽圖片僅限使用於此網站，請勿盜用')
        }, '200');
    }
};

function Check() {
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

function move_to_top() {
    if (window.scrollTo) {
        window.scrollTo({'behavior': 'smooth', 'top': 0})
    }
};

function counter() {
    let word = document.getElementsByName('msg')[0].value
    document.getElementById('word_counter').innerText = word.length
};

function show_notice() {
    var item = document.querySelector('.notice')
    item.style.display = "flex"
};

function unshow_notice() {
    var item = document.querySelector('.notice')
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