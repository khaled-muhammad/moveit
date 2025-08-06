import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../consts';

const SessionContext = createContext(null);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  
  const checkBeamHasNotes = async (beamId) => {
    try {
      const response = await api.get('/notes/beam_notes/', {
        params: { beam_id: beamId },
        withCredentials: true
      });
      return response.data && response.data.length > 0;
    } catch (error) {
      console.error('Error checking beam notes:', error);
      return false;
    }
  };

  const newSession = async () => {
    try {
      const response = await api.post("beams/create/")
      console.log("Beam created:", response.data)
      const expiresAt = new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ).toISOString()
      const newSession = { ...response.data, expiresAt: expiresAt }
      setSession(newSession)
      localStorage.setItem("session", JSON.stringify(newSession))
    } catch (error) {
      console.error("Error creating beam:", error)
    }
  }
  
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      let savedBeamSession = localStorage.getItem("session");
      if (savedBeamSession != null) {
        const parsedSession = JSON.parse(savedBeamSession);
        
        checkBeamHasNotes(parsedSession.beam_id).then(hasNotes => {
          if (hasNotes) {
            console.log("Saved beam has notes, creating new session");
            newSession();
          } else {
            console.log("Saved beam has no notes, loading existing session");
            setSession(parsedSession);
          }
        });
      } else {
        newSession();
      }
    }
  }, []);

  const value = {
    session,
    setSession,
    newSession,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};