#!/usr/bin/env python3
from django.urls import path
from dashboard import views, consumer


urlpatterns =[
    path('', views.index , name="home"),
]
ws_urlpatterns = [
    path('ws/tableData/', consumer.TableData.as_asgi()),
]
