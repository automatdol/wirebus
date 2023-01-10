import json

import websockets

from channels.generic.websocket import AsyncWebsocketConsumer

class BinanceConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = 'binance'
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()
        ticker = 'btcusdt'
        ws_url = f'wss://stream.binance.com:9443/ws/{ticker}@bookTicker'
        async with websockets.connect(ws_url) as ws:
            async def receive_binance_updates():
                async for msg in ws:
                    data = json.loads(msg)

                    await self.channel_layer.group_send(self.group_name,{
                            'type': 'update_data',
                            'data': {'exchange':'Binance','price':data['a']},
                        })

            await receive_binance_updates()

    async def disconnect(self, close_code):
        await ws.close()

    async def update_data(self, event):
        data = event['data']

        await self.send(text_data=json.dumps({
            'exchange': data['exchange'],
            'price': data['price']
        }))
