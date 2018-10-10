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
    if not request.is_json:
        return Response(json.dumps({'success': False}), mimetype='application/json')
    if 'mode' in request.json:
        if args['mode'] == 'reboot':
            os.system('sudo reboot')
            return Response(json.dumps({'success': True}), mimetype='application/json')
        elif args['mode'] == 'shutdown':
            os.system('sudo shutdown now')
            return Response(json.dumps({'success': True}), mimetype='application/json')

@app.route('/config/wifi/scan', methods=['GET'])
def scan():
    try:
        networks = pyfi.scan()
        return Response(json.dumps({'success': True, 'result': networks}), mimetype='application/json')
    except:
        return Response(json.dumps({'success': False}), mimetype='application/json')

@app.route('/config/wifi/connect', methods=['POST'])
def connect():
    if not request.is_json:
        return Response(json.dumps({'success': False}), mimetype='application/json')
    try:
        if 'ssid' in request.json:
            if 'psk' in request.json:
                pyfi.connect(request.json['ssid'], request.json['psk'])
                return Response(json.dumps({'success': True}), mimetype='application/json')
            else:
                pyfi.connect(request.json['ssid'])
                return Response(json.dumps({'success': True}), mimetype='application/json')
    except:
        return Response(json.dumps({'success': False}), mimetype='application/json')

@app.route('/drive/<path:path>')
def drive(**kwargs):
    path = '/media/' + kwargs['path']
    if os.path.isdir(path):
        dirpath = '/' + kwargs['path']
        items = []
        for entry in sorted(os.scandir(path), key=lambda item: item.name.lower()):
            if entry.is_dir():
                items.append({'type': 'Directory', 'name': entry.name, 'path': '/drive' + entry.path[6:] + '/'})
            else:
                items.append({'type': 'File', 'name': entry.name, 'path': '/drive' + entry.path[6:]})
        return render_template('fm.html', path=dirpath, items=items)
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
    path = '/cgiserver/static/' + kwargs['path']
    if os.path.isfile(path):
        return send_file(path)
    else:
        abort(404)

@app.route('/')
def index():
    path = '/cgiserver/static/index.html'
    if os.path.isfile(path):
        return send_file(path)
    else:
        abort(404)
