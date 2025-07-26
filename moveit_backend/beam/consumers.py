import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from channels.db import database_sync_to_async
from .models import Beam

class BeamConsumer(WebsocketConsumer):
    def connect(self):
        self.beam_id = self.scope["url_route"]["kwargs"]["beam_id"]
        self.beam_group_name = f"beam_channel_{self.beam_id}"

        self.accept()

    def disconnect(self, close_code):
        # Leave beam group
        async_to_sync(self.channel_layer.group_discard)(
            self.beam_group_name, self.channel_name
        )

    @database_sync_to_async
    def auth_connection(self, beam_key):
        found = Beam.objects.filter(beam_id=self.beam_id, beam_key=beam_key).count() != 0
        
        if found:
            # Join beam group
            async_to_sync(self.channel_layer.group_add)(
                self.beam_group_name, self.channel_name
            )



        return found

    # Receive message from WebSocket
    def receive(self, text_data):
        res = json.loads(text_data)
        res_type = res["type"]
        message  = res["message"]

        print("REC TYPE:", res_type)
        if res_type == 'auth':
            authed = async_to_sync(self.auth_connection)(message)

            if authed:
                self.send(text_data=json.dumps({
                    "type": "auth_sucess",
                    "message": "Beaming",
                }))
            else:
                self.send(text_data=json.dumps({
                    "type": "auth_failed",
                    "message": "Beaming failed!",
                }))

                self.close()
                return

        # Send message to beam group
        async_to_sync(self.channel_layer.group_send)(
            self.beam_group_name,
            {
                "type": "beam.message",
                "message": message
            }
        )

    # Receive message from beam group
    def beam_message(self, event):
        message = event["message"]

        # Send message to WebSocket
        self.send(text_data=json.dumps({"message": message}))