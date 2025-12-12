import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    setUser(null);
  };

  const setSocketInstance = (socketInstance) => {
    setSocket(socketInstance);
  };

  const value = {
    user,
    socket,
    login,
    logout,
    setSocketInstance
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};