from django.contrib import admin

from .models import Experience, MediaAsset, Skill

admin.site.register(Skill)
admin.site.register(Experience)
admin.site.register(MediaAsset)
