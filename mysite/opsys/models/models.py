#coding:utf-8
from django.db import models
from django.contrib.auth.models import User

class ServerList(models.Model):
    game = models.CharField(max_length=20, blank=False,null=False)
    area = models.CharField(max_length=20, blank=False,null=False)
    device = models.CharField(max_length=20, blank=False,null=False)
    innerip = models.CharField(max_length=25, blank=False,null=False)
    outip = models.CharField(max_length=25, blank=False,null=False)
    user = models.CharField(max_length=25, blank=False,null=False)
    passwd = models.CharField(max_length=30,blank=False,null=False)
    info = models.CharField(max_length=200,blank=False,null=False)
    onlyflag = models.CharField(max_length=20,blank=False,null=False,unique=True)
    class Meta:
        db_table = u'serverlist'
        app_label = 'opsys'
    def __unicode__(self):
        return u'%s_%s_%s' % (self.game, self.area, self.info)

#这个权限代表的是用户开通了哪些地方的权限
class TopRight(models.Model):
    right = models.CharField(max_length=200,blank=False,null=False)
    def __unicode__(self):
        return u'%s' % (self.right)
class UserRight(models.Model):
    userid = models.ForeignKey(User)
    right  = models.ManyToManyField(TopRight)
    class Meta:
        db_table = u'userright'
        app_label = 'opsys'
    def __unicode__(self):
        return u'%s' % self.userid

class UserOpRecord(models.Model):
    userid = models.ForeignKey(User)
    optime = models.DateField(blank=False,null=False,auto_now_add=True)
    type = models.IntegerField(blank=False,null=False)
    opobject = models.TextField()
    class Meta:
        db_table = u'useroprecord'
        app_label = 'opsys'

#用户偏好
class UserPreference(models.Model):
    userid = models.ForeignKey(User, unique=True)
    lastlogin = models.CharField(max_length=30)
    screen = models.IntegerField(default=3)
    searcher = models.CharField(max_length=1024, default="http://www.baidu.com/s?wd=")
    def __unicode__(self):
        return u'%s' % self.userid


class MyAppList(models.Model):
    userid = models.ForeignKey(User)
    game = models.CharField(max_length=20,default="")
    area = models.CharField(max_length=20,default="")
    device = models.CharField(max_length=20,default="")
    allapp = models.TextField()
    position = models.IntegerField(blank=False,null=False,default=0)
    class Meta:
        db_table = u'myapplist'
        app_label = 'opsys'
    def __unicode__(self):
        return u'%s_%s_%s_%s_%d' % (self.userid,self.game,self.area,self.device,self.position)

# Create your models here.
