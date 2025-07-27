import { createContext, useContext, useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';

const WebSocketContext = createContext(null);

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children, session }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [sharedClipboards, setSharedClipboards] = useState([]);

  const webSocketConfig = {
    onOpen: () => sendJsonMessage({ type: 'auth', message: session?.beam_key }),
    shouldReconnect: (closeEvent) => true,
    shouldConnect: !!session,
  };

  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
  } = useWebSocket(
    session ? `ws://${window.location.host}/ws/beam/${session.beam_id}/` : null,
    webSocketConfig
  );

  useEffect(() => {
    if (lastJsonMessage != null) {
      if (lastJsonMessage.type === 'auth_sucess') {
        setIsConnected(true);
        console.log(lastJsonMessage.message)
      } else if (lastJsonMessage.type == 'authed_users') {
        setConnectedDevices(lastJsonMessage.users)
      } else if (lastJsonMessage.type == 'share_clipboard') {
        setSharedClipboards([...sharedClipboards, {id: Date.now(), content: lastJsonMessage.message, extra: lastJsonMessage.extra}])
      } else if (lastJsonMessage.type == 'delete_note') {
        setSharedClipboards(sharedClipboards.filter((cb) => cb.content != lastJsonMessage.message))
      }
    }
  }, [lastJsonMessage]);

  const shareClipBoard = (clipboard, clipboardType='text') => {
    sendJsonMessage({
      type: 'share_clipboard',
      message: clipboard,
      extra: clipboardType,
    })
  }

  const value = {
    isConnected,
    connectedDevices,
    setConnectedDevices,
    sharedClipboards,
    setSharedClipboards,
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
    shareClipBoard,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};