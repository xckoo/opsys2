#coding:utf-8
from django.shortcuts import render
from opsys.models.models import *
from opsys.utils.utils import *
from django.shortcuts import render_to_response
from django.template import loader, RequestContext
from django.contrib import auth
from django.contrib.auth.models import User
from opsys.utils import makeconx
from views import getcommpara
import sys
import os
import paramiko
import logging

def rl_logging(str):
    logger = logging.getLogger('django')
    logger.error(str)


def ssh_cmd(ip,port,cmd,user,passwd):
    str = u"ip:%s cmd:%s" % (ip,cmd)
    rl_logging(str)
    result = ""
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(ip,port,user,passwd,timeout=5)
        stdio,stdout,stderr = ssh.exec_command(cmd.encode('utf-8'))
        result = stdout.read()
        ssh.close()
        result = result.replace("\t", "&emsp;")
        result = result.replace("\n", "<br>")
        return 0,result
    except Exception as e:
        return -1,'ssh_cmd error'

def GetSvrInfo(request, onlyflag):
    ret,game,area,device = getcommpara(request)
    if not ret:
        return ret ,'获得公共参数失败'

    objlist = ServerList.objects.filter(game=game, area=area, onlyflag=onlyflag)
    if  len(objlist) > 1:
        return -1, '数据库信息出错, 唯一数据记录:%d' % len(objlist)
    return 0, objlist[0]

def GetGlobalInfo(request):
    ret,game,area,device = getcommpara(request)
    if not ret:
        return ret ,'获得公共参数失败'
    onlyflag = '%s_%s' % (game, area)
    objlist = ServerList.objects.filter(game=game, area=area, onlyflag=onlyflag)
    if  len(objlist) > 1:
        return -1, '数据库信息出错, 唯一数据记录:%d' % len(objlist)
    return 0, objlist[0]

def GetDevInfo(request):
    ret,game,area,device = getcommpara(request)
    if not ret:
        return ret ,'获得公共参数失败'
    onlyflag = '%s_%s_d' % (game, area)
    objlist = ServerList.objects.filter(game=game, area=area, onlyflag=onlyflag)
    if  len(objlist) > 1:
        return -1, '数据库信息出错, 唯一数据记录:%d' % len(objlist)
    return 0, objlist[0]

def GetPlayerInfoByUID(request):
    try:
        onlyflag = request.POST['onlyflag']
        uid = request.POST['uid']
    except:
        return JsonResponse({'ret':-1, 'msg':'请传入正确参数'})

    ret, svrinfo = GetSvrInfo(request, onlyflag)
    if ret != 0:
        return JsonResponse({'ret':ret, 'msg': svrinfo})

    tmplist = onlyflag.split("_")
    pt = tmplist[0]
    areaid = tmplist[1]

    cmd = '/data/tool/get_user %s %s %s' % (pt, areaid, uid)
    ret,msg = ssh_cmd(svrinfo.outip, 22, cmd, svrinfo.user, svrinfo.passwd)
    msg = msg.replace("\n", "<br/>")
    msg = "<br/>"+msg
    return JsonResponse({'ret':ret,'msg':msg})

def GetPlayerInfoByName(request):
    try:
        onlyflag = request.POST['onlyflag']
        username = request.POST['username']
    except:
        return JsonResponse({'ret':-1, 'msg':'请传入正确参数'})

    ret, svrinfo = GetSvrInfo(request, onlyflag)
    if ret != 0:
        return JsonResponse({'ret':ret, 'msg': svrinfo})

    tmplist = onlyflag.split("_")
    pt = tmplist[0]
    areaid = tmplist[1]

    cmd = '/data/tool/get_user_by_name %s %s %s' % (username, pt, areaid)
    ret,msg = ssh_cmd(svrinfo.outip, 22, cmd, svrinfo.user, svrinfo.passwd)
    msg = msg.replace("\n", "<br/>")
    msg = "<br/>"+msg
    return JsonResponse({'ret':ret,'msg':msg})
def Award(request):
    try:
        username = request.POST['username']
        onlyflag = request.POST['serverid']
        type = request.POST['type']
        count = request.POST['count']
    except:
        return JsonResponse({'ret':-1, 'msg':'请传入正确参数'})

    ret, svrinfo = GetSvrInfo(request, onlyflag)
    if ret != 0:
        return JsonResponse({'ret':ret, 'msg': svrinfo})

    tmplist = onlyflag.split("_")
    pt = tmplist[0]
    area = tmplist[1]

    int_value = int(count)
    #int_serverid = int(serverid)
    int_serverid = len(tmplist)
    allnames = username.split('\n')

    returnmsg = '<br/>'
    sendmailmsg = ''
    cmd = ''
    if len(allnames) > 20:
        return JsonResponse({'ret':-1,'msg':u'一次性最多20个'})
    if len(allnames) > 2 and type == '1' and int_value > 3000:
        return JsonResponse({'ret':-1,'msg':u'批量增加元宝不得超过3000个'})
    for oneuser in allnames:
        if type == '0':
            if int_value < 0 or int_value > 3000:
                if int_serverid < 3:
                    return JsonResponse({'ret':-1,'msg':u'元宝非法'})
            cmd = '/data/tool/add_cash_no_log %s %s %s %s' % (oneuser,count,pt,area)
            if int_value >= 10 and int_serverid < 3:
                sendmailmsg += u"为 %s 充值 %d 元宝，请注意！操作人:%s\n" % (oneuser,int_value,request.user.username)
        elif type == '1':
            if int_value < 0 or int_value > 50000:
                return JsonResponse({'ret':-1,'msg':u'数目非法'})
            cmd = '/data/tool/add_coin_no_log %s %s %s %s' % (oneuser,count,pt,area)
        elif type == '2':
            if int_value < 0 or int_value > 200:
                return JsonResponse({'ret':-1,'msg':u'数目非法'})
            try:
                propid = request.POST['propid']
            except:
                return JsonResponse({'ret':-1,'msg':u'请传入道具id'})
            int_val = int(propid)
            if int_val < 0 or int_val > 40:
                return JsonResponse({'ret':-1,'msg':u'道具id非法:%s'%int_val})
            cmd = '/data/tool/add_shopbag %s %s %s %s %s' % (oneuser,propid,count,pt,area)

        ret,msg = ssh_cmd(svrinfo.outip, 22, cmd, svrinfo.user, svrinfo.passwd)

        if ret != 0:
            returnmsg += u'用户名:[%s]失败：%d-%s\n' % (ret,msg)
        else:
            returnmsg += u'<br/>用户名:[%s] msg:%s' % (oneuser,msg)
        #这里判断系统消息
        if 'msg' in request.POST and request.POST['msg']:
            cmd_msg = '/data/tool/add_sys_msg %s %s %s %s' % (oneuser,request.POST['msg'],pt,area)
            ret2,msg2 = ssh_cmd(ip,22,cmd_msg,'root',passwd)
    if type == '1' and int_serverid < 3:
        send_mail(u'%s批量元宝%d 充值人数：%d'%(request.user.first_name,int_value,len(allnames)),sendmailmsg.encode('utf-8'))
    return JsonResponse({'ret':0,'msg':returnmsg})

def GetPwd(request):
    try:
        username = request.POST['username']
    except:
        return JsonResponse({'ret':-1,'msg':u'请传入username'})
    ip="203.195.181.135"
    passwd = 'renlong!@#'
    cmd= '/root/get_xkuser %s' % username
    ret,msg = ssh_cmd(ip,22,cmd,'root',passwd)
    return JsonResponse({'ret':ret,'msg':msg})

def ChangePwd(request):
    try:
        name = request.POST['name']
        newpwd = request.POST['newpwd']
    except:
        return JsonResponse({'ret':-1,'msg':u'请输入所需字段'})
    ip='203.195.181.135'
    passwd = 'renlong!@#'
    cmd = '/data/tool/change_pwd %s %s' % (name,newpwd)
    ret,msg = ssh_cmd(ip,22,cmd,'root',passwd)
    return JsonResponse({'ret':ret,'msg':msg})

def QueryTotal(request):
    try:
        username = request.POST['username']
        needdate = request.POST['needdate']
        onlyflag = request.POST['serverid']
    except:
        return JsonResponse({'ret':-1,'msg':u'请传入所需数据'})

    ret, svrinfo = GetSvrInfo(request, onlyflag)
    if ret != 0:
        return JsonResponse({'ret':ret, 'msg': svrinfo})

    tmplist = onlyflag.split("_")
    pt = tmplist[0]
    areaid = tmplist[1]
    cmd = '/data/tool/get_order_byname %s %s %s' % (pt,areaid,username)
    ret,msg = ssh_cmd(svrinfo.outip, 22, cmd, svrinfo.user, svrinfo.passwd)
    msg = msg.replace("\n", "<br/>")
    msg = "<br/>"+msg
    return JsonResponse({'ret':ret,'msg':msg})

def ConvertTxt(msg):
    msg = msg.replace("[type:1|",u"[type:招募消耗")
    msg = msg.replace("[type:2|",u"[type:道具消耗")
    msg = msg.replace("[type:3|",u"[type:礼包消耗")
    msg = msg.replace("[type:4|",u"[type:复活消耗")
    msg = msg.replace("[type:5|",u"[type:闯关消耗")
    msg = msg.replace("[type:6|",u"[type:国家宝藏")
    msg = msg.replace("[type:7|",u"[type:财神消耗")
    msg = msg.replace("[type:8|",u"[type:抢夺官职")
    msg = msg.replace("[type:9|",u"[type:国战宣战")
    msg = msg.replace("[type:10|",u"[type:竞技cd")
    msg = msg.replace("[type:11|",u"[type:玩摇钱树")
    msg = msg.replace("[type:12|",u"[type:全局聊天")
    msg = msg.replace("[type:13|",u"[type:大大转盘")
    msg = msg.replace("[type:14|",u"[type:vip礼包")
    msg = msg.replace("[type:15|",u"[type:转国消耗")
    msg = msg.replace("[type:16|",u"[type:刮刮乐乐")
    msg = msg.replace("[type:17|",u"[type:自动国战")
    msg = msg.replace("[type:18|",u"[type:购买生命")
    msg = msg.replace("[type:19|",u"[type:购买连击")
    msg = msg.replace("[type:20|",u"[type:限购礼包")
    msg = msg.replace("[type:21|",u"[type:开百宝箱")
    msg = msg.replace("[type:22|",u"[type:富豪活动")
    msg = msg.replace("[type:23|",u"[type:忍者培养")
    msg = msg.replace("[type:24|",u"[type:pve官邸")
    msg = msg.replace("[type:25|",u"[type:边境之战")
    msg = msg.replace("[type:26|",u"[type:跨服门票")
    msg = msg.replace("[type:27|",u"[type:跨服押宝")
    msg = msg.replace("[type:28|",u"[type:跨服激励")
    msg = msg.replace("[type:29|",u"[type:立即合成")
    msg = msg.replace("[type:30|",u"[type:神秘商店")
    return msg

def CashLog(request):
    try:
        username = request.POST['username']
        needdate = request.POST['needdate']
        onlyflag = request.POST['onlyflag']
    except:
        return JsonResponse({'ret':-1,'msg':u'请传入所需数据'})

    ret, svrinfo = GetSvrInfo(request, onlyflag)
    if ret != 0:
        return JsonResponse({'ret':ret, 'msg': svrinfo})

    tmplist = onlyflag.split("_")
    pt = tmplist[0]
    areaid = tmplist[1]

    #获得uid
    ip = svrinfo.outip
    cmd = '/data/tool/nickinfonew %s %s %s' % (username,pt,areaid)
    ret,msg = ssh_cmd(ip,22,cmd,svrinfo.user,svrinfo.passwd)
    if  ret != 0 :
        return JsonResponse({'ret':ret,'msg':msg})
    if msg.find("error") == 0:
        return JsonResponse({'ret':-1,'msg':u'用户名不存在'})
    msg = msg.replace('\n','')
    msg = msg.replace('\r','')
    msg = msg.replace('<br>','')
    id=msg
    cmd = '/data/tool/get_cashlog.sh %s %s' % (msg,needdate)
    ret,msg = ssh_cmd(ip,22,cmd,svrinfo.user,svrinfo.passwd)
    msg = msg.replace("\n","<br/>")
    msg = "<br/>"+msg
    #msg = msg.split("rpt")[0]
    msg = ConvertTxt(msg)
    msg = msg.replace("[%s]"%id,"")
    msg = msg.replace("|rpt","---")
    msg = msg.replace("|rsvr","")
    msg = msg.replace("][","--")
    msg = msg.replace("|","--")
    msg = msg.replace("subtype:","--")
    msg = msg.replace("count:1","")
    msg = msg.replace("amount:",u"--数目:")
    msg = msg.replace("type:","-")
    msg = msg.replace("%s"%needdate,"")
    return JsonResponse({'ret':ret,'msg':msg})

def AddCard(request):
    try:
        username = request.POST['username']
        cardtype = str(int(request.POST['cardtype'])+1)
        cardid = request.POST['cardid']
        exp = request.POST['exp']
        starlevel = request.POST['starlevel']
        newlife = request.POST['newlife']
        onlyflag = request.POST['onlyflag']
    except:
        return JsonResponse({'ret':-1,'msg':'请传入正确参数'})

    ret, svrinfo = GetSvrInfo(request, onlyflag)
    if ret != 0:
        return JsonResponse({'ret':ret, 'msg': svrinfo})

    tmplist = onlyflag.split("_")
    pt = tmplist[0]
    areaid = tmplist[1]

    cmd = '/data/tool/add_card_byname %s %s %s %s %s %s %s %s' % (username,cardtype,cardid,pt,areaid,exp,starlevel,newlife)
    ret,msg = ssh_cmd(svrinfo.outip,22,cmd,svrinfo.user,svrinfo.passwd)
    #if ret == 0:
        #send_mail(u"%s正式服加卡%s" % (request.user.username,cardid),u"为 %s 加卡 id:%s,type:%s,exp:%s,starlevel:%s,newlife:%s，请注意！操作人:%s" % (username,cardid,cardtype,exp,starlevel,newlife,request.user.username))
    return JsonResponse({'ret':ret,'msg':msg})

def GenCode(request):
    try:
        serverid = request.POST['serverid']
        type = request.POST['type']
        count = request.POST['count']
        game = request.POST['game']
        area = request.POST['area']
    except:
        return JsonResponse({'ret':-1,'msg':'请传入正确参数'})
    int_value = int(count)
    if int_value <= 0 or int_value >50000:
        return JsonResponse({'ret':-1,'msg':u'数目非法'})
    int_value = int(type)
    if (int_value <=0):
        return JsonResponse({'ret':-1,'msg':u'类型非法'})

    onlyflag = '%s_%s' % (game, area)
    if int(serverid) == '0': #测试服
        onlyflag = '%s_d' % onlyflag

    ret, svrinfo = GetSvrInfo(request, onlyflag)
    if ret != 0:
        return JsonResponse({'ret':ret, 'msg': svrinfo})
    tmplist = onlyflag.split("_")
    pt = tmplist[0]
    areaid = tmplist[1]

    cmd = ''
    if int(serverid) == 0: #测试服
        cmd = '/data/tool/GenInvite %s %s %s %s' % (pt,areaid,type,count)
    elif int(serverid) == 1:
        cmd = '/data/tool/GenGlobalInvite %s %s' % (type,count)

    ret,msg=ssh_cmd(svrinfo.outip, 22, cmd,svrinfo.user, svrinfo.passwd)

    return JsonResponse({'ret':ret,'msg':msg})

def GambleGet(request):
    try:
        onlyflag = request.POST['onlyflag']
    except:
        return JsonResponse({'ret':-1,'msg':'请传入正确参数'})

    ret, svrinfo = GetSvrInfo(request, onlyflag)
    if ret != 0:
        return JsonResponse({'ret':ret, 'msg': svrinfo})
    tmplist = onlyflag.split("_")
    pt = tmplist[0]
    areaid = tmplist[1]

    cmd = '/data/tool/get_gambleconf %s %s' % (pt,areaid)
    ret,msg = ssh_cmd(svrinfo.outip,22,cmd,svrinfo.user,svrinfo.passwd)
    return JsonResponse({'ret':ret,'msg':msg})

def FengHao(request):
    try:
        onlyflag = request.POST['onlyflag']
        name = request.POST['name']
        type = request.POST['type']
    except:
        return JsonResponse({'ret':-1,'msg':'请传入正确参数'})

    ret, svrinfo = GetSvrInfo(request, onlyflag)
    if ret != 0:
        return JsonResponse({'ret':ret, 'msg': svrinfo})
    tmplist = onlyflag.split("_")
    pt = tmplist[0]
    areaid = tmplist[1]

    cmd = '/data/tool/set_closeuser_byname  %s %s %s %s' % (name,pt,areaid,type)
    ret,msg = ssh_cmd(svrinfo.outip,22,cmd,svrinfo.user,svrinfo.passwd)
    return JsonResponse({'ret':ret,'msg':msg})

def AddExp(request):
    try:
        onlyflag = request.POST['onlyflag']
        name = request.POST['name']
        val = request.POST['val']
    except:
        return JsonResponse({'ret':-1,'msg':'请传入正确参数'})

    if int(val) < 1 or int(val)>100000:
        return JsonResponse({'ret':-1,'msg':u'经验值必须在1到10w之间'})

    ret, svrinfo = GetSvrInfo(request, onlyflag)
    if ret != 0:
        return JsonResponse({'ret':ret, 'msg': svrinfo})
    tmplist = onlyflag.split("_")
    pt = tmplist[0]
    areaid = tmplist[1]

    cmd = '/data/tool/add_exp_by_name %s %s %s %s' % (pt,areaid,name,val)
    ret,msg = ssh_cmd(svrinfo.outip,22,cmd,svrinfo.user,svrinfo.passwd)
    return JsonResponse({'ret':ret,'msg':msg})


def SetVip(request):
    try:
        onlyflag = request.POST['onlyflag']
        name = request.POST['name']
        score = request.POST['score']
    except:
        return JsonResponse({'ret':-1,'msg':'请传入正确参数'})

    if int(score) < 1 or int(score)>2000000:
        return JsonResponse({'ret':-1,'msg':u'积分必须在1到200w之间'})

    ret, svrinfo = GetSvrInfo(request, onlyflag)
    if ret != 0:
        return JsonResponse({'ret':ret, 'msg': svrinfo})
    tmplist = onlyflag.split("_")
    pt = tmplist[0]
    areaid = tmplist[1]

    cmd = '/data/tool/set_vipinfo_byname %s %s %s %d' % (pt,areaid,name,score)
    ret,msg = ssh_cmd(svrinfo.outip,22,cmd,svrinfo.user,svrinfo.passwd)
    return JsonResponse({'ret':ret,'msg':msg})

def AddCumulate(request):
    try:
        onlyflag = request.POST['onlyflag']
        username = request.POST['username']
        num = request.POST['num']
    except:
        return JsonResponse({'ret':-1,'msg':'请传入正确参数'})

    ret, svrinfo = GetSvrInfo(request, onlyflag)
    if ret != 0:
        return JsonResponse({'ret':ret, 'msg': svrinfo})
    tmplist = onlyflag.split("_")
    pt = tmplist[0]
    areaid = tmplist[1]

    cmd = '/data/tool/add_pay_cumu_sum_byname %s %s %s %s' % (pt,areaid,username,num)
    ret,msg = ssh_cmd(svrinfo.outip,22,cmd,svrinfo.user,svrinfo.passwd)
    msg = msg.replace("\n", "<br/>")
    msg = "<br/>"+msg
    return JsonResponse({'ret':ret,'msg':msg})

def AddFlower(request):
    try:
        onlyflag = request.POST['onlyflag']
        username = request.POST['username']
        num = request.POST['num']
    except:
        return JsonResponse({'ret':-1,'msg':'请传入正确参数'})

    ret, svrinfo = GetSvrInfo(request, onlyflag)
    if ret != 0:
        return JsonResponse({'ret':ret, 'msg': svrinfo})
    tmplist = onlyflag.split("_")
    pt = tmplist[0]
    areaid = tmplist[1]

    cmd = '/data/tool/add_flower_by_name %s %s %s %s' % (pt,area,username,num)
    ret,msg = ssh_cmd(svrinfo.outip,22,cmd,svrinfo.user,svrinfo.passwd)
    msg = msg.replace("\n", "<br/>")
    msg = "<br/>"+msg
    return JsonResponse({'ret':ret,'msg':msg})

def CheckMaxId(request):
    try:
        onlyflag = request.POST['onlyflag']
    except:
        return JsonResponse({'ret':-1,'msg':'请传入正确参数'})
    ret, svrinfo = GetSvrInfo(request, onlyflag)
    if ret != 0:
        return JsonResponse({'ret':ret, 'msg': svrinfo})
    tmplist = onlyflag.split("_")
    pt = tmplist[0]
    areaid = tmplist[1]

    cmd = '/data/tool/get_max_id %s %s' % (pt,areaid)
    ret,msg = ssh_cmd(svrinfo.outip,22,cmd,svrinfo.user,svrinfo.passwd)
    msg = msg.replace("\n", "<br/>")
    msg = "<br/>"+msg
    return JsonResponse({'ret':ret,'msg':msg})

def CheckSvrTime(request):
    servertime = ''
    try:
        optype = request.POST['optype']
        if optype != '1':
            servertime = request.POST['servertime']
            servertime = servertime.replace(" ", "\ ")
    except:
        return JsonResponse({'ret':-1,'msg':'请传入正确参数'})

    ret, svrinfo = GetDevInfo(request)
    if ret != 0:
        return JsonResponse({'ret':ret, 'msg': svrinfo})

    cmd = '/data/tool/check_servertime.sh %s %s' % (optype, servertime)
    ret,msg = ssh_cmd(svrinfo.outip,22,cmd,svrinfo.user,svrinfo.passwd)
    msg = msg.replace("\n", "<br/>")
    msg = "<br/>"+msg
    return JsonResponse({'ret':ret,'msg':msg})


def ResetChap(request):
    try:
        onlyflag = request.POST['onlyflag']
        username = request.POST['username']
        chapid = request.POST['chapid']
    except:
        return JsonResponse({'ret':-1,'msg':'请传入正确参数'})

    ret, svrinfo = GetSvrInfo(request, onlyflag)
    if ret != 0:
        return JsonResponse({'ret':ret, 'msg': svrinfo})
    tmplist = onlyflag.split("_")
    pt = tmplist[0]
    areaid = tmplist[1]

    cmd = '/data/tool/set_chapworld %s %s 1 1 2 %s %s' % (username,chapid,pt,areaid)
    ret,msg = ssh_cmd(svrinfo.outip,22,cmd,svrinfo.user,svrinfo.passwd)
    return JsonResponse({'ret':ret,'msg':msg})


def PubCsv(request):
    try:
        server_type = request.POST['server_type']
        group_type = request.POST['group_type']
        restart = request.POST['restart']
        csvfile = request.POST['csvfile']
    except:
        return JsonResponse({'ret':-1,'msg':'请传入正确参数'})

    group = 'ios'
    restartdes = 'norestart'
    if group_type == '1':
        group = 'and'
    if group_type == '2':
        group = 'apple'
    if restart == '1':
        restartdes = 'restart'

    ret, svrinfo = GetDevInfo(request)
    if ret != 0:
        return JsonResponse({'ret':ret, 'msg': svrinfo})

    filename = '/data/release/renlong/csv/' + csvfile

    if server_type=='0':
        csvpath = '/data/home/publish_csv/update_csvdev.sh'
    else:
        csvpath = '/data/home/publish_csv/update_csvidc.sh'

    cmd = "%s %s %s %s" % (csvpath, group, restartdes, csvfile )
    ret,msg = ssh_cmd(svrinfo.outip,22,cmd,svrinfo.user,svrinfo.passwd)
    return JsonResponse({'ret':ret,'msg':msg})

