from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/beam/(?P<beam_id>\w+)/$", consumers.BeamConsumer.as_asgi()),
]