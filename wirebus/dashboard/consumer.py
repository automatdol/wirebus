from channels.generic.websocket import AsyncWebsocketConsumer

class TableData(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name='tableData'
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):

        await self.channel_layer.group_discard(self.group_name,
                                               self.channel_name)

    async def receive(self, text_data):
        print(text_data)
