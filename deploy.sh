#!/bin/bash
cd /cygdrive/f/wcd-chat/wcd-ui &&
tar -zcf dist.tar dist &&
scp dist.tar pecloud@10.10.20.195:/tmp &&
cd /cygdrive/f/wcd-chat &&
tar -zcf server.tar wcd_server &&
scp server.tar pecloud@10.10.20.195:/tmp

ssh pecloud@10.10.20.195

cd /var/html &&
sudo cp /tmp/dist.tar /var/html/ &&
sudo rm -rf /var/html/wcd.cn &&
sudo tar xf dist.tar &&
sudo mv /var/html/dist /var/html/wcd.cn &&
sudo cp /var/html/wcd.cn/assets/js/service-worker.js /var/html/wcd.cn/service-worker.js &&
sudo chown apache -R /var/html/wcd.cn &&
sudo chgrp apache -R /var/html/wcd.cn &&
sudo chmod -R 755 /var/html/wcd.cn &&

cd /data/mysite &&
sudo cp /tmp/server.tar /data/mysite &&
sudo rm -rf /data/mysite/wcd_server &&
sudo tar xf server.tar &&
sudo chown apache -R /data/mysite/wcd_server &&
sudo chgrp apache -R /data/mysite/wcd_server &&
sudo chmod -R 755 /data/mysite/wcd_server &&
sudo supervisorctl restart all
