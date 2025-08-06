import json
import random
import string
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from channels.db import database_sync_to_async
from .models import Beam
from note.models import Note

NICKNAMES = [
    "PixelPenguin", "CodeCactus", "QuantumKoala", "BitBunny", "HexHawk",
    "NeonNarwhal", "LogicLynx", "DebugDuck", "SyncSquirrel", "ByteBear"
]

AUTHED_USERS = {}

class BeamConsumer(WebsocketConsumer):
    def connect(self):
        self.beam_id = self.scope["url_route"]["kwargs"]["beam_id"]
        self.beam_group_name = f"beam_channel_{self.beam_id}"
        self.client_id = None
        self.nickname = None

        self.accept()

    def disconnect(self, close_code):
        if self.client_id and self.beam_id in AUTHED_USERS:
            AUTHED_USERS[self.beam_id] = [
                user for user in AUTHED_USERS[self.beam_id]
                if user["client_id"] != self.client_id
            ]
            if not AUTHED_USERS[self.beam_id]:
                del AUTHED_USERS[self.beam_id]

        async_to_sync(self.channel_layer.group_send)(
            self.beam_group_name,
            {
                "type": "auth.users",
                "users": AUTHED_USERS.get(self.beam_id, [])
            }
        )

        async_to_sync(self.channel_layer.group_discard)(
            self.beam_group_name,
            self.channel_name
        )

    @database_sync_to_async
    def auth_connection(self, beam_key=None):
        return Beam.objects.filter(beam_id=self.beam_id).exists()
    
    @database_sync_to_async
    def save_clipboard(self, content, content_type, user):
        try:
            beam = Beam.objects.get(beam_id=self.beam_id)
            if content_type != 'lexi_note':
                note = Note.objects.create(
                    user=user,
                    beam=beam,
                    content=content,
                    note_type=content_type
                )
            else:
                note = Note.objects.create(
                    user=user,
                    beam=beam,
                    title=content['title'],
                    json_content=content['content'],
                    note_type='lexi_note'
                )

            return note
        except Beam.DoesNotExist:
            return None

    def assign_client_id(self):
        return ''.join(random.choices(string.ascii_letters + string.digits, k=8))

    def assign_random_nickname(self):
        return random.choice(NICKNAMES)

    def receive(self, text_data):
        res = json.loads(text_data)
        res_type = res["type"]
        message  = res["message"]
        extra    = res.get("extra")

        if res_type == 'auth':
            authed = async_to_sync(self.auth_connection)(message)
            if authed:
                self.client_id = self.assign_client_id()
                self.nickname = self.assign_random_nickname()

                if self.beam_id not in AUTHED_USERS:
                    AUTHED_USERS[self.beam_id] = []

                AUTHED_USERS[self.beam_id].append({
                    "client_id": self.client_id,
                    "nickname": self.nickname
                })

                async_to_sync(self.channel_layer.group_add)(
                    self.beam_group_name,
                    self.channel_name
                )

                self.send(text_data=json.dumps({
                    "type": "auth_success",
                    "message": {
                        "client_id": self.client_id,
                        "nickname": self.nickname
                    }
                }))

                async_to_sync(self.channel_layer.group_send)(
                    self.beam_group_name,
                    {
                        "type": "auth.users",
                        "users": AUTHED_USERS[self.beam_id]
                    }
                )
            else:
                self.send(text_data=json.dumps({
                    "type": "auth_failed",
                    "message": "Beaming failed!"
                }))
                self.close()

        elif res_type == 'message':
            async_to_sync(self.channel_layer.group_send)(
                self.beam_group_name,
                {
                    "type": "beam.message",
                    "message": message
                }
            )
        elif res_type == 'share_clipboard':
            if self.scope['user'].is_authenticated:
                note = async_to_sync(self.save_clipboard)(message, extra, self.scope['user'])
                if note:
                    print(f"Saved clipboard as note: {note.id}")
                else:
                    print("Failed to save clipboard as note")
            
            async_to_sync(self.channel_layer.group_send)(
                self.beam_group_name,
                {
                    "type": "share_clipboard",
                    "message": message,
                    "extra": extra,
                    "is_original_sender": False
                }
            )
        else:
            async_to_sync(self.channel_layer.group_send)(
                self.beam_group_name,
                {
                    "type": res_type,
                    "message": message,
                    "extra": extra,
                }
            )

    @database_sync_to_async
    def connect_user_with_beam_db(self, beam_name):
        beam = Beam.objects.get(beam_id=self.beam_id)
        beam.user = self.scope['user']
        beam.beam_name = beam_name
        print(beam.user)
        beam.save()
    
    def save_beam(self, event):
        print("Connecting user to beam ....")
        async_to_sync(self.connect_user_with_beam_db)(event['message'])

    def beam_message(self, event):
        self.send(text_data=json.dumps({
            "type": "message",
            "message": event["message"]
        }))

    def share_clipboard(self, event):
        print(self.scope['user'])
        content = event.get("message")
        content_type = event.get("extra", "text")
        is_original_sender = event.get("is_original_sender", False)
        
        if is_original_sender and self.scope['user'].is_authenticated:
            note = async_to_sync(self.save_clipboard)(content, content_type, self.scope['user'])
            if note:
                print(f"Saved clipboard as note: {note.id}")
            else:
                print("Failed to save clipboard as note")
        
        self.send(text_data=json.dumps({
            "type": "rec_clipboard",
            "message": content,
            "extra": content_type
        }))

    def auth_users(self, event):
        self.send(text_data=json.dumps({
            "type": "authed_users",
            "users": event["users"]
        }))

    def __getattr__(self, name):
        if name.startswith("_") or name in self.__dict__:
            raise AttributeError(f"'{type(self).__name__}' object has no attribute '{name}'")
        
        def handler(event):
            print("Unlisted:")
            print(event)
            self.send(text_data=json.dumps({
                "type": name,
                "message": event.get("message"),
                "extra": event.get("extra", None)
            }))
        return handler