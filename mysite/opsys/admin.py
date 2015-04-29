from django.contrib import admin

from models.models import ServerList
from models.models import UserRight
from models.models import MyAppList
from models.models import TopRight
from models.models import UserPreference

admin.site.register(ServerList)
admin.site.register(UserRight)
admin.site.register(MyAppList)
admin.site.register(TopRight)
admin.site.register(UserPreference)

# Register your models here.
