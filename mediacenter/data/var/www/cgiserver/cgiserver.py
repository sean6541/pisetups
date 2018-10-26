from flask import Flask
app = Flask(__name__)
from flask import abort
from flask.helpers import send_file
import os
from flask import request
import json
import pyfi
from flask import render_template
from flask import Response

app.use_x_sendfile = True

@app.route('/power', methods=['POST'])
def power():
    if 'mode' in request.json:
        if request.json['mode'] == 'reboot':
            os.system('sudo reboot')
            return
        elif request.json['mode'] == 'shutdown':
            os.system('sudo shutdown now')
            return

@app.route('/wifi/scan', methods=['GET'])
def scan():
    networks = pyfi.scan()
    return Response(json.dumps(networks), mimetype='application/json')

@app.route('/wifi/connect', methods=['POST'])
def connect():
    if 'ssid' in request.json:
        if 'psk' in request.json:
            pyfi.connect(request.json['ssid'], request.json['psk'])
            return
        else:
            pyfi.connect(request.json['ssid'])
            return

@app.route('/drive/<path:path>')
def drive(**kwargs):
    path = '/media/' + kwargs['path']
    if os.path.isdir(path):
        dir_path = '/' + kwargs['path']
        items = []
        for entry in sorted(os.scandir(path), key=lambda item: item.name.lower()):
            if entry.is_dir():
                items.append({'type': 'Directory', 'name': entry.name, 'path': '/drive' + entry.path[6:] + '/'})
            else:
                items.append({'type': 'File', 'name': entry.name, 'path': '/drive' + entry.path[6:]})
        return render_template('fm.html', path=dir_path, items=items)
    else:
        if os.path.isfile(path):
            return send_file(path)
        else:
            abort(404)

@app.route('/drive/')
def drives():
    items = []
    for entry in sorted(os.scandir('/media'), key=lambda item: item.name.lower()):
        items.append({'type': 'Drive', 'name': entry.name, 'path': '/drive' + entry.path[6:] + '/'})
    return render_template('fm.html', path='/', items=items)

@app.route('/<path:path>')
def main(**kwargs):
    path = '/var/www/cgiserver/static/' + kwargs['path']
    if os.path.isfile(path):
        return send_file(path)
    elif os.path.isdir(path):
        index_file = ''
        if path[-1:] == '/':
            index_file = path + 'index.html'
        else:
            index_file = path + '/index.html'
        if os.path.isfile(index_file):
            return send_file(index_file)
        else:
            abort(404)
    else:
        abort(404)

@app.route('/')
def index():
    path = '/var/www/cgiserver/static/index.html'
    if os.path.isfile(path):
        return send_file(path)
    else:
        abort(404)
