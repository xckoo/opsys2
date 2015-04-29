#encoding:utf-8

FORMS = {
    'input':'''<div class="form-group">
                    <label >%s</label>
                    <div class="input"><input class="form-control" id="%s" placeholder="%s"></div>
               </div>\n''',
    'select':'''<div class="form-group">
                    <label >%s</label>
                    <div class="input"><select class="form-control" id="%s">%s</select></div>
                </div>\n''',

    'svrselect':'''<div class="form-group">
                      <label >%s</label>
                      <div class="input"><select class="form-control" id="%s">%s</select></div>
                   </div>\n''',
    'textarea':'''
                <div class="form-group">
                    <label >%s</label>
                    <div class="input"><textarea class="form-control" id="%s" rows="5"></textarea></div>
                </div>\n''',
    'checkbox':'''
                <div class="form-group">
                    <label >%s</label>
                    <div class="input"><input type='checkbox' class="checkbox" id="%s"></div>
                </div>\n''',

    'sumbit':'''<div class="form-group">
                    <label ></label>
                    <div class="input"><button type="submit" id="%s" onclick="return click_button();" class="btn btn-primary">提交</button></div>
                </div>\n''',

    'date': '''<div class="form-group">
                    <label>%s</label>
                    <div class="input-group input date form_datetime">
                        <input id="%s" size="16" type="text" class="form-control" value="" readonly>
                        <span class="input-group-addon"><span class="glyphicon glyphicon-th"></span></span>
                    </div>
               </div>\n'''
}

def gen_input(line):
    html =   FORMS['input'] % (line['label'], line['id'], line['placeholder'])
    return html.encode("utf-8")

def gen_select(line):
    base_code = ''
    for i, option in enumerate(line['option']):
        base_code = base_code +  '<option value="%d">%s</option>' % (i, option)

    html =  FORMS['select'] % (line['label'],line['id'], base_code)
    return html.encode("utf-8")

def gen_sumbit(line):
    html =  FORMS['sumbit'] % line['id'].encode("utf-8")
    return html.encode("utf-8")

def gen_textarea(line):
    html =  FORMS['textarea'] % (line['label'], line['id'])
    return html.encode("utf-8")

def gen_checkbox(line):
    html =  FORMS['checkbox'] % (line['label'], line['id'])
    return html.encode("utf-8")
def gen_date(line):
    html = FORMS['date'] % ( line['label'], line['id'])
    return html.encode("utf-8")
