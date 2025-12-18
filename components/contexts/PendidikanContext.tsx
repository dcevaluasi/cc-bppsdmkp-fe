// PendidikanContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of your context
interface PendidikanContextType {
  idSatdikSelected: string | null;
  setIdSatdikSelected: React.Dispatch<React.SetStateAction<string | null>>;
}

// Create a context
const PendidikanContext = createContext<PendidikanContextType | undefined>(
  undefined
);

// Create a provider component
export const PendidikanProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [idSatdikSelected, setIdSatdikSelected] = useState<string | null>(null);

  return (
    <PendidikanContext.Provider
      value={{ idSatdikSelected, setIdSatdikSelected }}
    >
      {children}
    </PendidikanContext.Provider>
  );
};

// Create a custom hook to use the context
export const usePendidikanContext = (): PendidikanContextType => {
  const context = useContext(PendidikanContext);
  if (context === undefined) {
    throw new Error(
      "usePendidikanContext must be used within a GlobalProvider"
    );
  }
  return context;
};
