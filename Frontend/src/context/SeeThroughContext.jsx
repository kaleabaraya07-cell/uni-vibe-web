import { createContext, useContext, useState, useCallback } from "react";

const SeeThroughContext = createContext(null);

export function SeeThroughProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [vibe, setVibe] = useState(null);
  const [panelType, setPanelType] = useState("image");

  const openSeeThrough = useCallback((vibeData, type = "image") => {
    setVibe(vibeData);
    setPanelType(type || vibeData?.type || "image");
    setOpen(true);
  }, []);

  const closeSeeThrough = useCallback(() => {
    setOpen(false);
    setVibe(null);
  }, []);

  return (
    <SeeThroughContext.Provider
      value={{ open, vibe, panelType, openSeeThrough, closeSeeThrough }}
    >
      {children}
    </SeeThroughContext.Provider>
  );
}

export function useSeeThrough() {
  const ctx = useContext(SeeThroughContext);
  if (!ctx) throw new Error("useSeeThrough must be used within SeeThroughProvider");
  return ctx;
}
