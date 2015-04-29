#coding:utf-8
import json
from django.http import HttpResponse
from django.db import models
import types
from decimal import *
from datetime import *
from math import ceil

def JsonResponse(val):
    def _any(data):
        ret = None
        if type(data) is types.ListType:
            ret = _list(data)
        elif type(data) is types.DictType:
            ret = _dict(data)
        elif isinstance(data, Decimal):
            ret = str(data)
        elif isinstance(data,models.query.QuerySet):
            ret = _list(data)
        elif isinstance(data,models.Model):
            ret = _model(data)
        elif isinstance(data, datetime):
            ret = data.strftime('%Y-%m-%d %H:%M:%S')
        else:
            ret = data
        return ret
    def _model(data):
        ret = {}
        for f in data._meta.fields:
            ret[f.attname] = _any(getattr(data,f.attname))
        return ret
    def _list(data):
        ret = []
        for v in data:
            ret.append(_any(v))
        return ret
    def _dict(data):
        ret = {}
        for k,v in data.items():
            ret[k] = _any(v)
        return ret
    ret = _any(val)
    return HttpResponse(json.dumps(ret,ensure_ascii = False));

def dic2urlpar(dicval):
    if type(dicval) is types.DictType:
        if len(dicval) == 0:
            return ''
        ret = ''
        for key,val in dicval.items()   :
            ret += str(key)
            ret += '='
            ret += val
            ret += '_'
        return ret[:-1]
    else:
        return dicval
def urlpar2dic(urlpar):
    args = {}
    parlist = urlpar.split('&')
    for onepar in parlist:
        pars = onepar.split('=')
        if len(pars) != 2:
            continue
        args[pars[0]] = pars[1]

    return args
#pagenum代表出现多少个页码
def getpagenum(all_count,one_page_count,current_page,pagenumber):
    pagedict = {}
    totle_page = int(ceil(all_count/one_page_count))
    if totle_page == 0:
        pagedict['close'] = True
        return pagedict
    pagedict['close'] = False
    if current_page != 1 and current_page < totle_page + 1:
        pagedict['hasprev'] = True
        pagedict['prev'] = current_page - 1
    if current_page != totle_page and current_page < totle_page:
        pagedict['hasnext'] = True
        pagedict['next'] = current_page + 1
    #构建页码
    if current_page < 1 or current_page > totle_page:
        current_page = 1
    number = [current_page]
    page_front = current_page
    page_back = current_page
    while page_front > 1 or page_back < totle_page:
        page_front = page_front - 1
        page_back = page_back + 1
        if page_front >= 1:
            number.append(page_front)
        if page_back <=totle_page:
            number.append(page_back)
        if len(number) >= pagenumber:
            break
    number.sort()
    pagedict['pages'] = number
    return pagedict
