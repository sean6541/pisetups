import os
import re

def scan():
    op = os.popen('sudo iwlist wlan0 scan').read()
    networks = []
    cells = re.findall(r'(.*Cell.*(\n|.)*?(?=(.*Cell)|$))', op)
    for cell in cells:
        ssid = re.findall(r'.*ESSID:"(.*?)"', cell[0])[0]
        if ssid != '':
            key = re.findall(r'.*Encryption key:(.*?)\n', cell[0])[0]
            if key == 'on':
                enc = True
            else:
                enc = False
            networks.append({'ssid': ssid, 'enc': enc})
    return networks

def connect(ssid, psk=''):
    if psk != '':
        open('/etc/wpa_supplicant/wpa_supplicant.conf', 'w').write('ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev\nupdate_config=1\ncountry=US\n\nnetwork={\n	ssid="' + ssid + '"\n	psk="' + psk + '"\n}\n')
    else:
        open('/etc/wpa_supplicant/wpa_supplicant.conf', 'w').write('ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev\nupdate_config=1\ncountry=US\n\nnetwork={\n	ssid="' + ssid + '"\n	key_mgmt=NONE\n}\n')
    os.system('sudo systemctl daemon-reload')
    os.system('sudo service dhcpcd restart')
    return
