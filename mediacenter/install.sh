#!/bin/bash

wget -O - https://dev2day.de/pms/dev2day-pms.gpg.key | apt-key add
echo 'deb https://dev2day.de/pms/ stretch main' > /etc/apt/sources.list.d/pms.list
apt-get update
apt-get -y install udevil python3 python3-flask apache2 libapache2-mod-wsgi-py3 libapache2-mod-xsendfile plexmediaserver-installer
cp -r ./data/* /
systemctl enable devmon.service
chmod -R 755 /var/www/cgiserver
chown pi:users /etc/wpa_supplicant/wpa_supplicant.conf
chmod 777 /etc/wpa_supplicant/wpa_supplicant.conf
a2dissite 000-default
a2ensite cgiserver
service apache2 restart
chmod +x /usr/bin/wlantolan
systemctl enable bridge.service
sed -i 's/#net.ipv4.ip_forward=1/net.ipv4.ip_forward=1/' /etc/sysctl.conf
echo -e 'www-data ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers
