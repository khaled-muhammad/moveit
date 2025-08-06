from urllib.parse import parse_qs
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import AnonymousUser


@database_sync_to_async
def get_user_from_token(token):
    try:
        validated_token = JWTAuthentication().get_validated_token(token)
        user = JWTAuthentication().get_user(validated_token)
        return user
    except Exception:
        return AnonymousUser()


class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        headers = dict(scope['headers'])

        token = None

        cookie_header = headers.get(b'cookie', b'').decode()
        cookies = {
            kv.split('=')[0]: kv.split('=')[1]
            for kv in cookie_header.split('; ') if '=' in kv
        }
        token = cookies.get('access_token', None)

        if not token:
            query_string = parse_qs(scope["query_string"].decode())
            token = query_string.get("token", [None])[0]

        scope['user'] = await get_user_from_token(token) if token else AnonymousUser()

        return await super().__call__(scope, receive, send)