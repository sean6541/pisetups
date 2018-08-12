#!/bin/bash

wget -O - https://dev2day.de/pms/dev2day-pms.gpg.key | apt-key add -
echo 'deb https://dev2day.de/pms/ stretch main' > /etc/apt/sources.list.d/pms.list
wget -q -O - https://apt.mopidy.com/mopidy.gpg | apt-key add -
wget -q -O /etc/apt/sources.list.d/mopidy.list https://apt.mopidy.com/stretch.list
apt-get update
apt -y install ./pkg/easy-x11.deb
apt-get -y install udevil kodi plexmediaserver-installer git mopidy python-pip python-lxml bluealsa python-dbus
python -m pip install Mopidy-Iris mopidy-gmusic
rm -r /usr/lib/python2.7/dist-packages/pyasn1
python -m pip install pyasn1-modules
cp -r ./data/* /
chmod +x /usr/local/bin/a2dp-agent
sed -i 's/# #DiscoverableTimeout = 0/DiscoverableTimeout = 0/' /etc/bluetooth/main.conf
coproc bluetoothctl
echo -e 'power on\ndiscoverable on\nexit' >&"${COPROC[1]}"
systemctl enable devmon.service
systemctl enable mopidy.service
systemctl enable bt-agent-a2dp.service
systemctl enable a2dp-playback.service
