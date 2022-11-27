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