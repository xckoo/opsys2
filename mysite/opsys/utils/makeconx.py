#encoding:utf-8

import os,sys
import json
import commands
import make_plug
reload(sys)
sys.setdefaultencoding('utf8')

CONFPATH = os.path.join( os.path.dirname(os.path.dirname(__file__)),'conf','html_conf.json' )
NOTICEPATH = os.path.join( os.path.dirname(os.path.dirname(__file__)),'conf','notice.json' )
PhoneBookPATH = os.path.join( os.path.dirname(os.path.dirname(__file__)),'conf','phoneBook.json' )

def gen_html(list_info):
    html_code = ''
    for i, line in enumerate(list_info):
        if line['type'] == 'input':
            html_code = html_code + make_plug.gen_input(line)

        elif line['type'] == 'select':
            html_code = html_code + make_plug.gen_select(line)

        elif line['type'] == 'sumbit':
            html_code = html_code + make_plug.gen_sumbit(line)

        elif line['type'] == 'textarea':
            html_code = html_code + make_plug.gen_textarea(line)

        elif line['type'] == 'checkbox':
            html_code = html_code + make_plug.gen_checkbox(line)

        elif line['type'] == 'svrselect':
            html_code = html_code + make_plug.gen_svrselect(line)

        elif line['type'] == 'date':
            html_code = html_code + make_plug.gen_date(line)

        elif line['type'] == 'html':
            html_code = '+!+html+!+';

        else:
            html_code = html_code +  '找不到匹配的type : %s' % line['type']
    return html_code

def get_json(appid):
    jsons = json.load(file(CONFPATH))
    conf = jsons[int(appid)]
    return conf

def conx(appid):

    form_list = []
    conf = get_json(appid)
    for item in conf['form']:
        form_list.append(item)
    html_code = gen_html(form_list)
    return conf['name'], html_code, conf['js']

def get_json_list():
    jsons = json.load(file(CONFPATH))
    return jsons

def get_notice_json():
    jsons = json.load(file(NOTICEPATH))
    return jsons

def get_phonebook_json():
    jsons = json.load(file(PhoneBookPATH))
    return jsons

if __name__ == '__main__':
    print NOTICEPATH
    print CONFPATH
    get_notice_json()
    #get_json_list()
