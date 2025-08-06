import { createContext, useContext, useState, useEffect } from 'react'
import useWebSocket from 'react-use-websocket'
import { api } from '../consts'
import toast from 'react-hot-toast'

const WebSocketContext = createContext(null)

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider')
  }
  return context
}

export const WebSocketProvider = ({ children, session }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [shouldConnect, setShouldConnect] = useState(null)
  const [connectedDevices, setConnectedDevices] = useState([])
  const [sharedClipboards, setSharedClipboards] = useState([])
  const [beamNotes, setBeamNotes] = useState([])
  const [isLoadingNotes, setIsLoadingNotes] = useState(false)

  const auth = () => {
    sendJsonMessage({ type: 'auth', message: session?.beam_key })
  }

  const loadBeamNotes = async (beamId, caller = 'unknown') => {
    setSharedClipboards([])
    
    if (!beamId) {
      return;
    }
    
    setIsLoadingNotes(true);
    
    try {
      const response = await api.get('/notes/beam_notes/', {
        params: { beam_id: beamId },
        withCredentials: true
      });
      
      if (response.data) {
        const convertedNotes = response.data.map((note, index) => ({
          id: note.id,
          content: note.content || note.title || 'Untitled Note',
          extra: note.note_type,
          worldX: Math.random() * (window.innerWidth - 300),
          worldY: Math.random() * (window.innerHeight - 200),
          isBeamNote: true,
          noteData: note,
          index: index
        }));
        
        setSharedClipboards(prev => {
          const nonBeamNotes = prev.filter(item => !item.isBeamNote);
          const newClipboards = [...nonBeamNotes, ...convertedNotes];
          return newClipboards;
        });
      }
    } catch (error) {
      console.error('Failed to load beam notes:', error);
      if (error.response?.status !== 401) {
        toast.error('Failed to load beam notes');
      }
    } finally {
      setIsLoadingNotes(false);
    }
  };

  const saveBeam = (beamTitle) => {
    sendJsonMessage({
      type: 'save_beam',
      message: beamTitle?? ''
    })
  }

  const webSocketConfig = {
    onOpen: auth,
    shouldReconnect: (closeEvent) => true,
  }

  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
  } = useWebSocket(
    session ? `ws://${window.location.host}/ws/beam/${session.beam_id}/` : null,
    webSocketConfig,
    shouldConnect == null? false : !!session
  )

  useEffect(() => {
    if (lastJsonMessage != null) {
      if (lastJsonMessage.type === 'auth_success' || lastJsonMessage.type === 'auth_sucess') {
        setIsConnected(true)
        if (session?.beam_id) {
          loadBeamNotes(session.beam_id, 'auth_success')
        }
      } else if (lastJsonMessage.type == 'authed_users') {
        setConnectedDevices(lastJsonMessage.users)
      } else if (lastJsonMessage.type == 'rec_clipboard') {
        setSharedClipboards([...sharedClipboards, {id: Date.now(), content: lastJsonMessage.message, extra: lastJsonMessage.extra}])
        if (lastJsonMessage.extra && lastJsonMessage.extra !== 'text') {
          if (session?.beam_id) {
            //loadBeamNotes(session.beam_id, 'share_clipboard') XXX
          }
        }
      } else if (lastJsonMessage.type == 'delete_note') {
        setSharedClipboards(sharedClipboards.filter((cb) => cb.content != lastJsonMessage.message))
        if (session?.beam_id) {
          loadBeamNotes(session.beam_id, 'delete_note')
        }
      } else if (lastJsonMessage.type == 'beam_notes_loaded') {
      } else {
      }
    }
  }, [lastJsonMessage, session?.beam_id])

  useEffect(() => {
    if (session?.beam_id && isConnected) {
      loadBeamNotes(session.beam_id, 'session_connected')
    } else {
      setSharedClipboards(prev => prev.filter(item => !item.isBeamNote))
    }
  }, [session?.beam_id, isConnected])

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
    isLoadingNotes,
    loadBeamNotes,
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
    shareClipBoard,
    auth,
    setShouldConnect,
    saveBeam
  }

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  )
}