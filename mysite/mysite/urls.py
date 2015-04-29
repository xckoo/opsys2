from django.conf.urls import patterns, include, url
from django.contrib import admin
from opsys.views.views import *
from opsys.views.tools import *

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'mysite.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),

    url(r'^login/$',login),
    url(r'^logout/$',logout),
    url(r'^ShowBox/$', showbox),
    #views
    url(r'^$',checklogin(index)),
    url(r'^index/$',checklogin(index)),

    #app Operater
    url(r'^AddApp/$',checkloginandright(addapp, 'makeapp')),
    url(r'^RemoveApp/$',checkloginandright(removeapp, 'makeapp')),
    url(r'^MoveApp/$',checkloginandright(moveapp, 'makeapp')),

    #index loading
    url(r'^GetUserApps/$', checklogin(getmyapplist)),
    url(r'^GetAppList/$', checklogin(getapplist)),
    url(r'^GetOneApp/$', checklogin(getoneapp)),
    url(r'^SelectRight/$', checklogin(SelectRight)),
    url(r'^LastLogin/$', checklogin(savelastlogin)),
    url(r'^PhoneBook/$', checklogin(getphonebook)),

    url(r'^userInfo/$', checklogin(userInfo)),
    url(r'^SetUserScreen/$', checklogin(SetUserScreen)),
    url(r'^SetUserSearch/$', checklogin(SetUserSearch)),

    #tools
    url(r'^playerinfo_byuid/$', checkloginandright(GetPlayerInfoByUID, 'readdata')),
    url(r'^playerinfo_byname/$', checkloginandright(GetPlayerInfoByName, 'readdata')),
    url(r'^Award/$', checkloginandright(Award, 'readdata')),
    url(r'^pwd/$', checkloginandright(GetPwd, 'readdata')),
    url(r'^changepwd/$', checkloginandright(ChangePwd, 'writedata')),
    url(r'^querytotal/$', checkloginandright(QueryTotal, 'readdata')),
    url(r'^cashlog/$', checkloginandright(CashLog, 'readdata')),
    url(r'^AddCardNew/$', checkloginandright(AddCard, 'writedata')),
    url(r'^gencode/$', checkloginandright(GenCode, 'writedata')),
    url(r'^gambleget/$', checkloginandright(GambleGet, 'readdata')),
    url(r'^fenghao/$', checkloginandright(FengHao, 'writedata')),
    url(r'^add_exp/$', checkloginandright(AddExp, 'writedata')),
    url(r'^setvip/$', checkloginandright(SetVip, 'writedata')),
    url(r'^addcumulat/$', checkloginandright(AddCumulate, 'writedata')),
    url(r'^addflower/$', checkloginandright(AddFlower, 'writedata')),
    url(r'^checkmaxid/$', checkloginandright(CheckMaxId, 'writedata')),
    url(r'^checksvrtime/$', checkloginandright(CheckSvrTime, 'writedata')),
    url(r'^ResetChap/$', checkloginandright(ResetChap, 'writedata')),
    url(r'^pubcsv/$', checkloginandright(PubCsv, 'writedata')),
)
