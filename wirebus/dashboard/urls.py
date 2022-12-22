#!/usr/bin/env python3
from django.urls import path
from dashboard import views

urlpatterns =[
    path('', views.index , name="home"),
]
