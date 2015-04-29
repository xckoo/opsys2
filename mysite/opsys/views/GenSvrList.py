#coding:utf-8
from django.shortcuts import render
from opsys.models.models import *
from opsys.utils.utils import *
from django.shortcuts import render_to_response
from django.template import loader, RequestContext
from django.contrib import auth
from django.contrib.auth.models import User
from opsys.utils import makeconx

import MySQLdb
import sys

#数据库句柄
g_db_conn = None

#数据库info
DB_IP = '182.254.185.247'
DB_USR = 'root'
DB_PWD = 'root'
DB_NAME = 'devops'

GAME = {'rl':'1', 'gl':'2'}
AREA = {'ch':'1', 'tw':'2', 'yn':'3', 'th':'4', 'rzwd':'5', 'yw':'6'}
DEVICE = {'and':'1', 'ios':'2', 'app':'3', 'mix':'4', 'wp':'5'}

def connect_db():
    """建立数据库连接
    """
    print '开始建立数据库连接'
    try:
        global g_db_conn
        g_db_conn = MySQLdb.connect(DB_IP, DB_USR, DB_PWD, DB_NAME, charset='utf8')
    except Exception, ex:
        logging.error('发生异常，异常信息: %s' % str(ex))
        return False

    print '建立数据库连接成功'
    assert g_db_conn
    return True


def get_svrlist(db_name, svrlist):
    print '开始载入数据'
    cursor = g_db_conn.cursor()

    sql = '''select name, innerip, outip, username, password, platform, zone from %s'''
    sql = sql % db_name
    try:
        cursor.execute(sql)
    except Exception, ex:
        print "获取列表失败， msg:%s" % str(ex)
        return False
    tuple_data = cursor.fetchall()

    for name, innerip, outip, user, passwd, pt, zone in tuple_data:
        onedict = {}
        onedict['info'] = name
        onedict['innerip'] = innerip
        onedict['outip'] = outip
        onedict['user'] = user
        onedict['passwd'] = passwd
        onedict['onlyflag'] = '%s_%s' % (pt, zone)
        onedict['pt'] = int(pt)
        svrlist.append(onedict)
    print '载入完成'
    return True

def get_device(pt):
    device = ''
    if pt in [60, 70]:
        device = DEVICE['and']

    elif pt in [2, 3, 4, 5, 50]:
        device = DEVICE['ios']

    elif pt in [90, 40]:
        device = DEVICE['app']

    elif pt in [81, 80, 61, 71]:
        device = DEVICE['mix']

    elif pt in [30]:
        device = DEVICE['wp']
    else:
        print '请添加对应的设备代码, pt:%d' % pt
        return False, ''
    return True, device

def send_svrlist(svrlist, db_name):
    print '准备上传服务器列表'
    version = db_name.split("_")
    game = GAME[version[0]]
    area = AREA[version[1]]
    retlist = []
    if not svrlist:
        print '列表为空, 退出'
        return False
    for item in svrlist:
        mysvr = ServerList()
        mysvr.game = game
        mysvr.area = area
        if item['info'] not in ['dev', 'global']:
            ret, mysvr.device = get_device(item['pt'])
            if not ret:
                return ret
        else:
            print 'global or dev,no need device '

        mysvr.innerip = item['innerip']
        mysvr.outip = item['outip']
        mysvr.user = item['user']
        mysvr.passwd = item['passwd']
        mysvr.info = item['info']
        mysvr.onlyflag = item['onlyflag']
        retlist.append(mysvr)
    print '开始上传服务器列表'
    for item in retlist:
        item.save()

    print '上传服务器列表信息成功'
    return True



def main(db_name):

    if not connect_db():
        return -1

    svrlist = []
    if not get_svrlist(db_name, svrlist):
        return -1

    if not send_svrlist(svrlist, db_name):
        return -1
    print '执行完成， 退出...'
    return 0
'''
if __name__ == '__main__':
    if len(sys.argv) != 2:
        print 'usage: %s db_name' % sys.argv[0]
        return -1

    if not connect_db():
        return -1

    exit(main(sys.argv[1]))
'''
