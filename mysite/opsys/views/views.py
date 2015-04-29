#coding:utf-8
from django.shortcuts import render
from opsys.models.models import *
from opsys.utils.utils import *
from django.shortcuts import render_to_response
from django.template import loader, RequestContext
from django.contrib import auth
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect,Http404
from opsys.utils import makeconx

import sys

#GAME_RENLONG = 1
GAME_MAP = {'1':'renlong', '2':'gulong'}
GAME_MAP_CN = {'1':u'火影', '2':u'古龙'}

#AREA_GUONEI = 1
AREA_MAP = {'1':'ch', '2':'tw', '3':'yn', '4':'th', '5':'rzwd', '6':'yw'}
AREA_MAP_CN = {'1':u'简中', '2':u'台湾', '3':u'越南', '4':u'泰国', '5':u'忍者无敌', '6':u'英文'}

#DEVICE_YUEYU = 1
#DEVICE_AND = 2
DEVICE_MAP = {'1':'and','2':'ios', '3':'app', '4':'mix', '5':'wp'}
DEVICE_MAP_CN = {'1':u'安卓','2':u'越狱', '3':u'正版', '4':u'混服', '5':u'微软'}

def get_right_str(game,area,device):
    if game not in GAME_MAP:
        return False,''
    if area not in AREA_MAP:
        return False,''
    if device not in DEVICE_MAP:
        return False,''
    right_str = '%s_%s_%s' % (game,area,device)
    return True, right_str

def get_rights_str(game,area,device,rights):
    if game not in GAME_MAP:
        return False,''
    if area not in AREA_MAP:
        return False,''
    if device not in DEVICE_MAP:
        return False,''

    right_str = "%s_%s_%s_%s" % (GAME_MAP[game],AREA_MAP[area], DEVICE_MAP[device], rights)
    return True,right_str

def checklogin(view):
    def new_view(request, *args, **kwargs):
        if not request.user.is_authenticated():
            return render_to_response('login.html')
        return view(request,*args,**kwargs)
    return new_view

def logout(request):
    auth.logout(request)
    return HttpResponseRedirect("/")

def getcommpara(request):
    try:
        game = request.POST['game']
        area = request.POST['area']
        device = request.POST['device']
    except:
        return False,None,None,None
    return True,game,area,device

def checkloginandright(view,rightstr):
    def new_view(request, *args, **kwargs):
        if not request.user.is_authenticated():
            return JsonResponse({'ret':-1, 'msg':u'未登录'})
            #return render_to_response('login.html')
        #return view(request,*args,**kwargs)
        try:
            game = request.POST['game']
            area = request.POST['area']
            device = request.POST['device']
        except:
            return JsonResponse({'ret':-1, 'msg':u'对不起，参数错误，请联系伟大哥!!'})

        #两级权限,先判断一级权限
        ret, top_right = get_right_str(game,area,device)
        #ret = False
        if not ret:
            return JsonResponse({'ret':-1, 'msg':u'对不起，该权限尚未开通'})


        userrightlist = UserRight.objects.filter(userid=request.user)
        if len(userrightlist) == 0:
            return JsonResponse({'ret':-1, 'msg':u'对不起，此用户暂无权限信息,请联系伟大哥'})
        myright = userrightlist[0]
        topright_list = []
        for onetopright in myright.right.all():
            topright = onetopright.right.replace(" ", "")
            topright_list.append(topright)
        if top_right in topright_list:
            pass
        else:
            return JsonResponse({'ret':-1, 'msg':'您无此一级权限，请联系伟大哥'})

        #下面判断二级细分权限
        ret, sed_right =  get_rights_str(game,area, device, rightstr)
        if not ret:
            return JsonResponse({'ret':-1,'msg':u'对不起，该细分权限出错'})
        grouplist = []
        for group  in request.user.groups.all():
            grouplist.append(group.name)
        if sed_right in grouplist:
            pass
        else:
            return JsonResponse({'ret':-1,'msg':'您无此细分权限,请联系伟大哥'})
        return view(request,*args,**kwargs)

    return new_view

def login(request):
    try:
        username = request.POST['username']
        pwd = request.POST['passwd']
    except:
        return JsonResponse({'ret':-1,'msg':u'参数错误!'})
    user = auth.authenticate(username=username,password=pwd)
    if user is not None and user.is_active:
        auth.login(request,user)
        return JsonResponse({'ret':0, 'msg':u'登陆成功'})
    return JsonResponse({'ret':-1,'msg':u'密码错误'})

#获取用户相关信息
def userInfo(request):
    myscreen = 3
    mysearcher = ''
    mylastlogin = ''
    str_cn = ''
    prefer = UserPreference.objects.filter(userid=request.user)
    myprefer = None
    if len(prefer):
        myprefer = prefer[0]
        myscreen = myprefer.screen
        mysearcher = myprefer.searcher
        if myprefer.lastlogin:  #如果已存储了最后一次登录地区

            ret, topright_list = getTopRight(request.user)
            if not ret:
                return JsonResponse({'ret':-1, 'msg':topright_list})

            #判断该记录是否还有权限登录
            if myprefer.lastlogin in topright_list:
                mylastlogin = myprefer.lastlogin
                str_cn = getGAD_cn(mylastlogin);

    if myscreen not in [1,2,3,4,5]:
        return JsonResponse({'ret':-1,'msg': u'后台数据出错，screen:%s' % defaultscreen})
    return JsonResponse({'ret':0,'screen': myscreen - 1, 'searcher':mysearcher, 'lastlogin':mylastlogin,'str_cn':str_cn, 'username':request.user.username})

# 分割game，area，device组成中文返回
def getGAD_cn(str):
    items = str.split("_")
    game = items[0]
    area = items[1]
    device = items[2]
    str_cn = '%s_%s_%s' % (GAME_MAP_CN[game], AREA_MAP_CN[area],DEVICE_MAP_CN[device])
    return str_cn

def getTopRight(user):
    userrightlist = UserRight.objects.filter(userid=user)
    if len(userrightlist) == 0:
        return False, u'对不起，此用户暂无权限信息,请联系伟大哥'

    myright = userrightlist[0]
    topright_list = []
    for onetopright in myright.right.all():
        topright_list.append(onetopright.right)
    return True, topright_list


#获取用户可使用的权限
def SelectRight(request):
    try:
        islogin = request.POST['islogin']
    except:
        return JsonResponse({'ret':-1, 'msg':u'传入参数有误..'})

    ret, topright_list = getTopRight(request.user)
    if not ret:
        return JsonResponse({'ret':-1, 'msg':topright_list})

    strCode = ''
    for top_right in topright_list:
        top_right = top_right.replace(" ", "")
        str_cn = getGAD_cn(top_right);

        #如果只有一个地区且是登录时请求，直接返回地区编码，不用选择
        if len(topright_list) == 1 and islogin == 'true':
            return JsonResponse({'ret':1, 'str':topright_list[0],'str_cn':str_cn})

        option = '<option value="%s">%s</option>\n'
        strCode += option % (top_right, str_cn)

    return JsonResponse({'ret':0,'options':strCode})


def savelastlogin(request):
    ret,game,area,device = getcommpara(request)
    if not ret:
        return JsonResponse({'ret':-1,'msg':u'获得公共参数失败'})

    #存储用户最新选择的版本
    lastlogin = '%s_%s_%s' % (game, area, device)
    prefer = UserPreference.objects.filter(userid=request.user)
    myprefer = None
    if len(prefer):
        myprefer = prefer[0]
    if not myprefer:
        myprefer =UserPreference(userid=request.user, lastlogin=lastlogin)
    else:
        myprefer.lastlogin = lastlogin
    myprefer.save()
    return JsonResponse({'ret':0, 'msg':'lastlogin:%s' % myprefer.lastlogin})


#获取用户应用列表
def getmyapplist(request):
    ret,game,area,device = getcommpara(request)
    if not ret:
        return JsonResponse({'ret':-1,'msg':u'获得公共参数失败'})

    myapplist = MyAppList.objects.filter(userid=request.user, game=game,area=area, device=device)
    applist = {'0':[], '1':[], '2':[], '3':[], '4':[], '5':[]}
    for appitem in myapplist:
        tmplist = []
        if appitem.allapp != '':
            tmplist = appitem.allapp.split('_')
        pos = '%s' % appitem.position
        applist[pos] = tmplist

    retlist = {}
    for keystr in applist:
        tmpapplist = []
        for i in applist[keystr]:
            app = {}
            conf = makeconx.get_json(i)
            app['id'] = conf['id']
            app['ico'] = conf['ico']
            app['title'] = conf['title']
            app['name'] = conf['name']
            tmpapplist.append(app)
        retlist[keystr] = tmpapplist
    return JsonResponse({'ret':0,'content':retlist})

def showbox(request):
    try:
        conf = makeconx.get_notice_json()
    except:
        return JsonResponse({'ret':-1, 'msg':'conf配置文件出错'})
    if int(conf['show']) == 0:
        return JsonResponse({'ret':-1, 'msg':u'无需显示'})

    return JsonResponse({'ret':0, 'conf':conf })

#添加应用
def addapp(request):
    ret,game,area,device = getcommpara(request)
    if not ret:
        return JsonResponse({'ret':-1,'msg':u'获得公共参数失败'})
    try:
        pos = request.POST['pos']
        appid = request.POST['appid']
    except:
        return JsonResponse({'ret':-1,'msg':u'请传入正确的参数'})
    posint = int(pos)
    if posint < 0 or posint > 5:
        return JsonResponse({'ret':-1, 'msg':u'pos参数越界'})

    ret, myapp, newappstr = logic_addapp(request.user, game, area, device, posint, appid)
    if ret != 0:
        return JsonResponse({'ret':ret, 'msg': newappstr})

    #保存
    if not myapp:
        myapp = MyAppList(userid=request.user, game=game, area=area, device=device, position=pos, allapp=newappstr)
        myapp.save()
    else:
        myapp.allapp = newappstr
        myapp.save()

    conf = makeconx.get_json(appid)
    return JsonResponse({'ret':0, 'msg':u'添加应用"%s"成功!' % conf['name']})

def logic_addapp(user, game, area, device, posint, appid):
    myapplist = MyAppList.objects.filter(userid=user,game=game,area=area,device=device, position=posint)
    myapp = None
    if len(myapplist):
        myapp = myapplist[0]
    allappstr = ''
    if myapp:
        allappstr = myapp.allapp
    allapp = []
    newapp = []
    if allappstr != '':
        allapp = allappstr.split('_')
    newapp = allapp
    if appid  in allapp:
        return -1, myapp, '此应用已经添加'
    newapp.append(appid)
    newappstr = '_'.join(newapp)
    return 0, myapp,  newappstr

def logic_removeapp(user, game, area, device, posint, appid):
    myapplist = MyAppList.objects.filter(userid=user,game=game,area=area,device=device, position=posint)
    myapp = None
    if len(myapplist):
        myapp = myapplist[0]
    allappstr = ''
    if myapp:
        allappstr = myapp.allapp
    else:
        return -1, myapp, '无应用可删除'
    allapp = []
    newapp = []
    if allappstr != '':
        allapp = allappstr.split('_')
    newapp = []
    for myid in allapp:
        if int(appid) != int(myid):
            newapp.append(myid)
    if len(newapp) == len(allapp):
        return -1, myapp, '此应用未添加，不需要删除'
    newappstr = ''
    if len(newapp):
        newappstr = '_'.join(newapp)
    return 0, myapp, newappstr


#删除应用
def removeapp(request):
    ret,game,area,device = getcommpara(request)
    if not ret:
        return JsonResponse({'ret':-1,'msg':u'获得公共参数失败'})
    try:
        pos = request.POST['pos']
        appid = request.POST['appid']
    except:
        return JsonResponse({'ret':-1,'msg':u'请传入正确的参数'})
    posint = int(pos)
    if posint < 0 or posint > 5:
        return JsonResponse({'ret':-1, 'msg':u'pos参数越界'})
    ret,myapp, newappstr = logic_removeapp(request.user, game, area, device, posint, appid)
    if ret != 0:
        return JsonResponse({'ret':ret, 'msg':newappstr})

    #保存
    myapp.allapp = newappstr
    myapp.save()
    conf = makeconx.get_json(appid)
    return JsonResponse({'ret':0, 'msg':u'删除应用"%s"成功!' % conf['name']})

def moveapp(request):
    ret,game,area,device = getcommpara(request)
    if not ret:
        return JsonResponse({'ret':-1,'msg':u'获得公共参数失败'})
    try:
        from_pos = request.POST['from_pos']
        to_pos = request.POST['to_pos']
        appid = request.POST['appid']
    except:
        return JsonResponse({'ret':-1,'msg':u'请传入正确的参数'})
    from_posint = int(from_pos)
    to_posint = int(to_pos)
    if from_posint == to_posint:
        return JsonResponse({'ret':-1, 'msg':u' 操作有误，不能移动到同一屏幕'})
    if from_posint < 0 or from_posint > 5 or to_posint < 0 or to_posint > 5:
        return JsonResponse({'ret':-1, 'msg':u'pos参数越界'})

    ret,from_myapp, from_newappstr = logic_removeapp(request.user, game, area, device, from_posint, appid)
    if ret != 0:
        return JsonResponse({'ret':ret, 'msg':from_newappstr})

    ret, to_myapp, to_newappstr = logic_addapp(request.user, game, area, device, to_posint, appid)
    if ret != 0:
        return JsonResponse({'ret':ret, 'msg': to_newappstr})

    #删除保存
    from_myapp.allapp = from_newappstr
    from_myapp.save()
    #增加保存
    if not to_myapp:
        to_myapp = MyAppList(userid=request.user, game=game, area=area, device=device, position=to_pos, allapp=to_newappstr)
        to_myapp.save()
    else:
        to_myapp.allapp = to_newappstr
        to_myapp.save()
    conf = makeconx.get_json(appid)
    return JsonResponse({'ret':0, 'msg':u'移动应用"%s"至屏幕%d成功' % (conf['name'], to_posint)})

#得到应用市场
def getapplist(request):
    ret,game,area,device = getcommpara(request)
    if not ret:
        return JsonResponse({'ret':-1,'msg':u'获得公共参数失败'})
    savedlist = [] #已添加应用id列表
    myapplist = MyAppList.objects.filter(userid=request.user, game=game,area=area, device=device)
    for appitem in myapplist:
        tmplist = []
        if appitem.allapp != '':
            tmplist = appitem.allapp.split('_')
            for item in tmplist:
                savedlist.append(int(item))

    applist = []
    jsons = makeconx.get_json_list()
    for i, item in enumerate(jsons):
        if i == 0:
            continue
        if int(item['id']) in savedlist:  #若已添加则不出现在应用市场上
            continue
        app = {}
        app['ico'] = item['ico']
        app['title'] = item['title']
        app['id'] = item['id']
        app['searchname'] = item['search']
        app['name'] = item['name']
        applist.append(app)
    return JsonResponse({'ret':0, 'appList':applist})

def comm_get(request):
    try:
        game = request.GET['game']
        area = request.GET['area']
        device = request.GET['device']
    except:
        return False,None,None,None
    return True,game,area,device
#获取每个应用的页面
def getoneapp(request):
    ret, game, area, device = comm_get(request)
    if not ret:
        return JsonResponse({'ret':-1,'msg':'请传入公共参数'})

    try:
        appid = int(request.GET['appid'])
    except:
        return JsonResponse({'ret':-1,'msg':'请传入应用id'})

    name, strCode, js = makeconx.conx(appid)
    commstr = 'var game=%s;var area=%s; var device=%s;' % (game, area, device)
    js = '%s%s' % (commstr, js)

    tmp_option = '<option value="0">svrlist</option>'
    if tmp_option in strCode:
        ret, slcode = makesvrlist(request)
        if not ret:
            return render_to_response('app_admin.html',{'name':name, 'form_group':slcode, 'js':js}, context_instance=RequestContext(request))
        strCode = strCode.replace(tmp_option, slcode)

    ishtml = '+!+html+!+'
    if ishtml in strCode:
        strCode = strCode.replace(ishtml, '')
        html = 'app_%d.html' % appid
        return render_to_response(html,{'name':name, 'form_group':strCode, 'js':js}, context_instance=RequestContext(request))

    return render_to_response('app_admin.html',{'name':name, 'form_group':strCode, 'js':js}, context_instance=RequestContext(request))

def getphonebook(request):
    try:
        conf = makeconx.get_phonebook_json()
    except:
        return JsonResponse({'ret':-1, 'msg':'conf配置文件出错'})

    strcode = ''
    for item in conf:
        tmpstr = '''
            <li class="namebox">
                <img src="%s">
                <div class="name">%s<span class="hide">%s</span></div>
                <div class="phone">%s</div>
            </li>
        '''
        strcode += tmpstr % (item['src'],item['name'],item['search'],item['phone'])

    return render_to_response('phonebook.html',{'li':strcode},context_instance=RequestContext(request))

    #return JsonResponse({'ret':0, 'conf':conf })

def makesvrlist(request):
    ret, game, area, device = comm_get(request)
    if not ret:
        return False, '获得公共参数失败'
    objlist = ServerList.objects.filter(game=game, area=area)
    strcode = ''
    itemlist = []
    for item in objlist:
        if item.info in ['global', 'dev']: #页面不显示global和开发机的选项
            continue
        items = item.info.split(" ")
        tt = items[0]
        pos = int(items[1][:-1])
        op_code = '<option value="%s">%s</option>' % (item.onlyflag, item.info)
        itemlist.append([tt, pos, op_code])
    itemlist = sorted(itemlist, key=lambda x:(x[0], x[1]))
    for item in itemlist:
        strcode = strcode + item[2]

    return True, strcode

def GetUserScreen(request):
    defaultscreen = 3;
    prefer = UserPreference.objects.filter(userid=request.user)
    myprefer = None
    if len(prefer):
        myprefer = prefer[0]
        defaultscreen = myprefer.screen
    if defaultscreen not in [1,2,3,4,5]:
        return JsonResponse({'ret':-1,'msg': u'后台数据出错，screen:%s' % defaultscreen})
    return JsonResponse({'ret':0,'screen': defaultscreen - 1})

def SetUserScreen(request):
    try:
        screen = int(request.POST['screen'])
    except:
        return JsonResponse({'ret':-1, 'msg':u'无法获取设置的参数!'})

    if screen not in [1,2,3,4,5]:
        return JsonResponse({'ret':-1, 'msg':u'设置的屏幕参数错误，请检查'})
    prefer = UserPreference.objects.filter(userid=request.user)
    myprefer = None
    if len(prefer):
        myprefer = prefer[0]
    if not myprefer:
        myprefer =UserPreference(userid=request.user, screen=screen)
    else:
        myprefer.screen = screen
    myprefer.save()
    return JsonResponse({'ret':0, 'msg':u'设置默认屏幕为%d成功!' % screen})

def GetUserSearch(request):
    searcher = '';
    prefer = UserPreference.objects.filter(userid=request.user)
    myprefer = None
    if len(prefer):
        myprefer = prefer[0]
        searcher = myprefer.searcher
    if not searcher:
        return JsonResponse({'ret':-1, 'msg': '获取设置的搜索引擎失败'})
    return JsonResponse({'ret':0,'searcher': searcher})

def SetUserSearch(request):
    try:
        search = request.POST['search']
    except:
        return JsonResponse({'ret':-1, 'msg':u'无法获取设置的参数!'})

    prefer = UserPreference.objects.filter(userid=request.user)
    myprefer = None
    if len(prefer):
        myprefer = prefer[0]
    if not myprefer:
        myprefer =UserPreference(userid=request.user, searcher=search)
    else:
        myprefer.searcher = search
    myprefer.save()
    return JsonResponse({'ret':0, 'msg':u'设置默认搜索引擎成功!'})

def index(request):
    return render_to_response('index.html', context_instance=RequestContext(request))
