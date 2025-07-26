import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

class BeamConsumer(WebsocketConsumer):
    def connect(self):
        self.beam_id = self.scope["url_route"]["kwargs"]["beam_id"]
        self.beam_group_name = f"beam_channel_{self.beam_id}"

        # Join beam group
        async_to_sync(self.channel_layer.group_add)(
            self.beam_group_name, self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave beam group
        async_to_sync(self.channel_layer.group_discard)(
            self.beam_group_name, self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

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