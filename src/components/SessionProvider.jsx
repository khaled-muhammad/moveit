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
  
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      let savedBeamSession = localStorage.getItem("session");
      if (savedBeamSession != null) {
        setSession(JSON.parse(savedBeamSession));
      } else {
        api
          .post("beams/create/")
          .then((response) => {
            console.log("Beam created:", response.data);
            const expiresAt = new Date(
              Date.now() + 24 * 60 * 60 * 1000
            ).toISOString();
            const newSession = { ...response.data, expiresAt: expiresAt };
            setSession(newSession);
            localStorage.setItem("session", JSON.stringify(newSession));
          })
          .catch((error) => {
            console.error("Error creating beam:", error);
          });
      }
    }
  }, []);

  const value = {
    session,
    setSession,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};