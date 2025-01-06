import { createContext, useState } from "react";

export const CaptainDataContext = createContext();

const CaptainContext = ({ children }) => {
  const [captain, setCaptain] = useState(null);
  const [loading, setIsLoading] = useState(false);
  return (
    <>
      <CaptainDataContext.Provider
        value={{ captain, setCaptain, loading, setIsLoading }}
      >
        {children}
      </CaptainDataContext.Provider>
    </>
  );
};

export default CaptainContext;
