from django.urls import path
from dashboard import consumer


ws_pattern = [
    path('ws/tableData/', consumer.TableData.as_asgi()),
]
