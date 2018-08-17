#!/usr/bin/python3

from flup.server.fcgi import WSGIServer
from flask import Flask
app = Flask(__name__)
from werkzeug.contrib.fixers import CGIRootFix
from flask.helpers import send_file
from flask import request
import json
import pyfi
import os

app.use_x_sendfile = True

@app.route('/<path:path>.<string:ext>')
def main(**kwargs):
    path = './static/' + kwargs['path'] + '.' + kwargs['ext']
    return send_file(path)

@app.route('/')
def index():
    return send_file('./static/index.html')

@app.route('/power', methods=['POST'])
def power():
    if request.is_json:
        args = request.json
    else:
        args = request.form
    if 'mode' in args:
        if args['mode'] == 'reboot':
            os.system('sudo reboot')
        elif args['mode'] == 'shutdown':
            os.system('sudo shutdown now')
        return ''

@app.route('/config/wifi/scan', methods=['GET'])
def scan():
    networks = pyfi.scan()
    return json.dumps(networks)

@app.route('/config/wifi/connect', methods=['POST'])
def connect():
    if request.is_json:
        args = request.json
    else:
        args = request.form
    if 'ssid' in args:
        if 'psk' in args:
            pyfi.connect(args['ssid'], args['psk'])
        else:
            pyfi.connect(args['ssid'])
        return ''

if __name__ == '__main__':
    WSGIServer(CGIRootFix(app)).run()
