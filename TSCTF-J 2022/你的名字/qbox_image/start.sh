#apt换源
sed -i "s@http://deb.debian.org@http://mirrors.aliyun.com@g" /etc/apt/sources.list
rm -Rf /var/lib/apt/lists/*
apt-get update
#安装chrome
apt-get install -y libappindicator1 fonts-liberation
dpkg -i google-chrome-stable_current_amd64.deb
apt-get install -fy
dpkg -i google-chrome-stable_current_amd64.deb
google-chrome-stable -version
#npm启动
cd qbox
npm install --production
npm start
