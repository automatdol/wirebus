#!/usr/bin/env python3

from __future__ import absolute_import, unicode_literals
import os

from celery import Celery
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wirebus.settings')

app = Celery('wirebus')

app.config_from_object('django.conf:settings',namespace='CELERY')
app.autodiscover_task()

app.conf.beat_schedule = {}
