#coding:utf-8
from django.shortcuts import render_to_response
from report.utils.utils import *
from django.shortcuts import get_object_or_404
from django.contrib import auth
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect,Http404
from django.utils import simplejson
from decimal import *
from datetime import *
from math import ceil
from django.db import models
from django.template import loader, RequestContext
import makeconx

def admincenter(request):
    return render_to_response('index.html', context_instance=RequestContext(request))

def GetOneApp(request):
    if 'appid' in request.GET and request.GET['appid']:
        appid = int(request.GET['appid'])
    else:
        return JsonResponse({'ret':-1,'msg':'请传入应用id'})
    title, strCode, js = makeconx.conx(appid)

    return render_to_response('app_admin.html',{'title':title, 'form_group':strCode, 'js':js}, context_instance=RequestContext(request))


