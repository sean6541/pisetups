#!/bin/bash

wget -O - https://dev2day.de/pms/dev2day-pms.gpg.key | apt-key add -
echo 'deb https://dev2day.de/pms/ stretch main' > /etc/apt/sources.list.d/pms.list
wget -q -O - https://apt.mopidy.com/mopidy.gpg | apt-key add -
wget -q -O /etc/apt/sources.list.d/mopidy.list https://apt.mopidy.com/stretch.list
apt-get update
apt -y install ./deb/easy-x11.deb
apt-get -y install udevil kodi plexmediaserver-installer git mopidy bluealsa python-dbus
cd ./tmp
git clone --depth 1 https://github.com/mopidy/mopidy-gmusic
cd ./mopidy-gmusic
python setup.py install
chmod -R 755 /usr/local/lib/python2.7/dist-packages/gmusicapi-*-py2.7.egg/EGG-INFO/*
cd ../
rm -r ./mopidy-gmusic
cd ../
cd ./tmp
git clone --depth 1 https://github.com/jaedb/Iris
cd ./Iris
python setup.py install
cd ../
rm -r ./Iris
cd ../
cp -r ./data/* /
chmod +x /usr/local/bin/a2dp-agent
sed -i 's/# #DiscoverableTimeout = 0/DiscoverableTimeout = 0/' /etc/bluetooth/main.conf
coproc bluetoothctl
echo -e 'power on\ndiscoverable on\nexit' >&"${COPROC[1]}"
systemctl enable devmon.service
systemctl enable mopidy.service
systemctl enable bt-agent-a2dp.service
systemctl enable a2dp-playback.service
