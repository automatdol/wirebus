from django.urls import path
from dashboard import views, consumer
from . import views

urlpatterns =[
    path('', views.index, name="home"),
]
ws_urlpatterns = [
    path('ws/tableData/', consumer.TableData.as_asgi()),
]
