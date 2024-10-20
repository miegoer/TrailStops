import React from "react";
import { createContext, useContext, useState, ReactNode } from "react";
import { MarkerType } from "../types/types";

// Define the shape of the context value
interface UserContextType {
  settings: { distance: string; speed: number };
  setSettings: React.Dispatch<React.SetStateAction<{ distance: string; speed: number }>>;
  settingsOverlay: boolean;
  setSettingsOverlay: React.Dispatch<React.SetStateAction<boolean>>;
  tripDetailsOverlay: boolean;
  setTripDetailsOverlay: React.Dispatch<React.SetStateAction<boolean>>;
  markers: MarkerType[];
  setMarkers: React.Dispatch<React.SetStateAction<MarkerType[]>>;
}

// Create the context with the appropriate type
const UserContext = createContext<UserContextType | undefined>(undefined);

// Define the props type for UserProvider
interface UserProviderProps {
  children: ReactNode;
}

const UserProvider = ({ children }: UserProviderProps) => {
  const [settings, setSettings] = useState({ distance: "km", speed: 3 });
  const [settingsOverlay, setSettingsOverlay] = useState(false);
  const [tripDetailsOverlay, setTripDetailsOverlay] = useState(false);
  const [markers, setMarkers] = useState<MarkerType[]>([]);

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
  );
};

// Custom hook to consume the UserContext
const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export { UserProvider, useUser };
