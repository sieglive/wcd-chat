# coding: utf-8
"""Module of deploy tool"""
#
# Author: Cao Jiahang
# Date: 2016-11-24
#

from fabric.api import cd, run, local, sudo, env, roles, put

# 服务器配置
env.roledefs = {
    'wcd': ['ws@10.11.1.83'],  # 前端服务器
}
#env.user = 'pecloud'
env.passwords = {
    'ws@10.11.1.83:22': '123',
}

env.hosts = [
    'ws@10.11.1.83',
]

@roles('wcd')
def deploy():
    remote_dist_tar = '/tmp/dist.tar'
    remote_server_tar = '/tmp/server.tar'

    with cd('wcd-ui'):
        local('ng build -aot')
        local('tar -zcf dist.tar dist')
        put('dist.tar', remote_dist_tar)

    local('tar -zcf server.tar wcd_server')
    put('server.tar', remote_server_tar)

    sudo('cp /tmp/dist.tar /var/html/')
    sudo('tar xf dist.tar')
    sudo('rm -rf /var/html/wcd.cn')
    sudo('mv /var/html/dist /var/html/wcd.cn')
    sudo('chmod -R 755 /var/html/wcd.cn')

    sudo('cp /tmp/server.tar /data/mysite')
    sudo('tar xf server.tar')
    sudo('rm -rf /data/mysite/wcd_server')
    sudo('chmod -R 755 /data/mysite/wcd_server')
    sudo('supervisorctl restart all')
