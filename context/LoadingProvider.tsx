import { useContext, useState, ReactNode, createContext } from "react";

interface LoadingContextType {
  loaded: boolean;
  setLoaded: (value: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [loaded, setLoaded] = useState<boolean>(false);

  return (
    <LoadingContext.Provider value={{ loaded, setLoaded }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
