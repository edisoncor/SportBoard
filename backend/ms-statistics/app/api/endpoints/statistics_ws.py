from fastapi import APIRouter, WebSocket, WebSocketDisconnect, status
from fastapi.responses import JSONResponse
from app.websocket.connection_manager import ConnectionManager
import logging

router = APIRouter()
manager = ConnectionManager()

@router.websocket("/ws/statistics")
async def websocket_statistics(websocket: WebSocket):
    """
    WebSocket para la transmisión y recepción de eventos de estadísticas en tiempo real.

    Permite a los clientes conectarse para recibir y enviar mensajes relacionados con estadísticas deportivas.
    La conexión se mantiene abierta para el envío y broadcast de mensajes a todos los clientes conectados.

    Args:
        websocket (WebSocket): Conexión WebSocket activa.
    """
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Aquí se puede manejar la lógica de eventos y broadcast
            await manager.broadcast(f"Mensaje recibido: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        logging.info("WebSocket desconectado")
