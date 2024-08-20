import React, { createContext, useState, useContext } from "react";

interface ErrorItem {
  id: string;
  message: string;
}

interface ErrorContextType {
  errors: ErrorItem[];
  addError: (message: string) => void;
  removeError: (id: string) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [errors, setErrors] = useState<ErrorItem[]>([]);

  const addError = (message: string) => {
    const newError: ErrorItem = {
      id: Date.now().toString(),
      message,
    };
    setErrors((prevErrors) => [...prevErrors, newError]);
  };

  const removeError = (id: string) => {
    setErrors((prevErrors) => prevErrors.filter((error) => error.id !== id));
  };

  return (
    <ErrorContext.Provider value={{ errors, addError, removeError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
};
