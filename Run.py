import datetime
import json
import logging
import os
import re

import requests
from flask import Flask, redirect, render_template, request, url_for, abort
from PIL import Image

app = Flask('', template_folder='', static_folder='')
logging.basicConfig(level=logging.DEBUG, filename='log.log', filemode='a', format='%(asctime)s %(levelname)s: %(message)s')
participant = [i[0:-4].split(';') for i in os.listdir('assets') if i.endswith('png')]
voted = []

with open('voted_ip.txt', 'r', encoding='utf-8') as file:
    voted_ip_list = file.read().split('\n')
    while True:
        if '' in voted_ip_list:
            voted_ip_list.remove('')
        else:
            break

with open('log.json', 'r', encoding = 'utf-8') as file:
    log = json.load(file)

for i in log:
    for j, k in log[i]:
        voted += [j]

@app.errorhandler(400)
def Error_400(e):
    return render_template('html/Error.html', code='400', reason='Bad Request', title='錯誤請求'), 400

@app.errorhandler(403)
def Error_403(e):
    return render_template('html/Error.html', code='403', reason='Forbidden', title='拒絕訪問'), 403

@app.errorhandler(404)
def Error_404(e):
    return render_template('html/Error.html', code='404', reason='Page Not Found', title='找不到頁面'), 404

@app.errorhandler(429)
def Error_429(e):
    return render_template('html/Error.html', code='429', reason='Too Many Requests', title='請求次數過多'), 429

@app.errorhandler(500)
def Error_500(e):
    return render_template('html/Error.html', code='500', reason='Internal Server Error', title='伺服器錯誤'), 500

@app.after_request
def after_request(response):
    environ = request.environ
    res = f"{environ.get('REMOTE_ADDR')} - - \"{environ.get('REQUEST_METHOD')} {environ.get('PATH_INFO')} {environ.get('SERVER_PROTOCOL')}\""
    if str(status_code := response.status_code)[0] == '5':
        logging.error(f'{res} {status_code}')
    elif str(status_code := response.status_code)[0] == '4':
        logging.warning(f'{res} {status_code}')
    else:
        logging.info(f'{res} {status_code}')
    return response

@app.route('/', methods=['GET','POST'])
@app.route('/index.html', methods=['GET','POST'])
def main():
    if request.method == 'GET':
        participant.sort(key= lambda x: len(log[x[0]]), reverse=True)
        return render_template(
            'index.html',
            participant = participant,
            log = log,
            voted = voted
        )
    else:
        auth_data = {
            'secret': '6LdSC14hAAAAAJD8CX7IWrnwETwTMK_Eks46JcKf',
            'response': request.form['g-recaptcha-response']
        }
        auth_result = requests.post('https://www.google.com/recaptcha/api/siteverify', data=auth_data)
        if not auth_result.json()['success']:
            return render_template('index.html', participant = participant, error_code = '驗證失敗', log = log, voted = voted)
            
        ip = request.environ.get('REMOTE_ADDR')
        start = datetime.datetime.strptime('2022-12-12 22:00:00', '%Y-%m-%d %H:%M:%S')
        end = datetime.datetime.strptime('2022-12-15 22:00:00', '%Y-%m-%d %H:%M:%S')
        now = datetime.datetime.now() + datetime.timedelta(hours=8)
        if now > start and now < end:
            try:
                uuid = requests.get(f'https://api.mojang.com/users/profiles/minecraft/{request.form["minecraft_id"]}').json().get('id')
            except:
                uuid = None
            if request.form["support"] not in log:
                log[request.form["support"]] = []
            if uuid and request.form["minecraft_id"] not in voted:
                if ip not in voted_ip_list:
                    voted_ip_list.append(ip)
                    voted.append(request.form["minecraft_id"])
                    log[request.form["support"]].append([request.form["minecraft_id"], request.form["msg"]])
                    with open('log.json', 'w', encoding = 'utf-8') as file:
                        json.dump(log, file, indent = 4)
                    with open('voted_ip.txt', 'a', encoding='utf-8') as file:
                        file.write(f'{ip}\n')
                    logging.info(f'{request.form["minecraft_id"]} Voted For {request.form["support"]}, Comment: {request.form["msg"]}, Total votes: {len(log[request.form["support"]])}')
                    return redirect(url_for('main'))
                else:
                    return render_template('index.html', participant = participant, error_code = '此IP已投過票', log = log, voted = voted)
            elif uuid:
                return render_template('index.html', participant = participant, error_code = '此ID已投過票', log = log, voted = voted)
            else:
                return render_template('index.html', participant = participant, error_code = '無效的遊戲ID', log = log, voted = voted)
        else:
            return render_template('index.html', participant = participant, error_code = '投票時間未開始或已結束', log = log, voted = voted)

@app.route('/SingUp', methods=['GET', 'POST'])
@app.route('/html//SingUp.html', methods=['GET', 'POST'])
def SingUp():
    if request.method == 'GET':
        return render_template('html/SingUp.html')
    else:
        start = datetime.datetime.strptime('2022-12-05 22:00:00', '%Y-%m-%d %H:%M:%S')
        end = datetime.datetime.strptime('2022-12-12 22:00:00', '%Y-%m-%d %H:%M:%S')
        now = datetime.datetime.now() + datetime.timedelta(hours=8)
        if now > start and now < end:
            file = request.files['file']
            if file.filename.split('.')[-1] not in ['png', 'jpg', 'jpeg']:
                return render_template('html/SingUp.html', error_code = '無效的檔案類型')
            else:   
                msg = re.sub('\\r\\n', '$n$', request.form["msg"])
                msg = re.sub('\\\|\/|:|\*|\?|\"|<|>|\|', '', msg)
                msg = msg if msg != '' else '無'
                filename = f'{request.form["minecraft_id"]};{msg}.png'
                for i, _ in participant:
                    if request.form["minecraft_id"] == i:
                        return render_template('html/SingUp.html', error_code = '此ID已報名過')
                if request.form["minecraft_id"] not in log:
                    log[request.form["minecraft_id"]] = []
                    with open('log.json', 'w', encoding = 'utf-8') as f:
                        json.dump(log, f, indent = 4)
                file.save(os.path.join('assets', filename))
                participant.append(filename[0:-4].split(';'))
                img = Image.open(f'assets/{filename}')
                icon = Image.open('watermark.png')
                img_w, img_h = img.size
                icon_w, icon_h = icon.size
                locals_w, locals_h = 0, 0
                while True:
                    locals_w = 0
                    while True:
                        img.paste(icon, (locals_w, locals_h), icon)
                        locals_w += int(icon_w * 1.4)
                        if locals_w > img_w:
                            break
                    locals_h += int(icon_h * 1.8)
                    if locals_h > img_h:
                        break
                img.save(f'assets/{filename}')
                logging.info(f'{request.form["minecraft_id"]} Upload The File')
                return render_template('html/SingUp.html', error_code = '已成功報名建築大賽')
        else:
            return render_template('html/SingUp.html', error_code = '活動尚未開始或已截止報名')

@app.route('/log.log')
@app.route('/log.json')
@app.route('/voted_ip.txt')
@app.route('/watermark.png')
@app.route('/test.py')
@app.route('/Run.py')
def forbidden():
    abort(403)

@app.route('/<file>')
def img(file):
    if file.endswith('.png'):
        return render_template('html/Img.html', img = file)
    else:
        abort(404)

@app.route('/terms')
def terms():
    return render_template('html/Terms.html')

@app.route('/api/votes')
def total_vote():
    return log

@app.route('/api/user/<user>')
def user_vote(user):
    for i in log:
        for j, k in log[i]:
            if user == j:
                return {'Result': 'SUCCESS', 'Message': f'{user} Has Voted For {i}, Comment: {k}'}
    return {'Result': 'FAIL', 'Message': 'Unknown User'}

@app.route('/api/contestant/<user>')
def contestant_vote(user):
    if user not in log:
        return {'Result': 'FAIL', 'Message': 'Unknown User'}
    else:
        return {'Result': 'SUCCESS', 'supporter': log[user], 'Total': len(log[user])}

if __name__ == "__main__":
    import sys

    from gevent import pywsgi
    app.config['DEBUG'] = True
    WebServer = pywsgi.WSGIServer(('0.0.0.0', 80), app)
    # , keyfile='key.pem', certfile='cert.pem', ssl_version= ssl.PROTOCOL_SSLv23)
    try:
        logging.info('Server STARTED')
        WebServer.serve_forever()
    except KeyboardInterrupt:
        logging.info('Server CLOSED')
        sys.exit()
    except Exception as e:
        logging.warring(f'Server CLOSED: {e}')
        sys.exit()
