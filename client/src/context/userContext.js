import { createContext, useContext, useState } from "react";

const UserContext = createContext()

const UserProvider = ({ children }) => {
  const [settings, setSettings] = useState({distance: "km", speed: 3});
  const [settingsOverlay, setSettingsOverlay] = useState(false);
  const [tripDetailsOverlay, setTripDetailsOverlay] = useState(false);
  const [markers, setMarkers] = useState({});
  return (
    <UserContext.Provider value={{ 
      settings, 
      setSettings, 
      settingsOverlay, 
      setSettingsOverlay,
      tripDetailsOverlay,
      setTripDetailsOverlay,
      markers, 
      setMarkers 
    }}>
      {children}
    </UserContext.Provider>
  )
}

const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export { UserProvider, useUser }