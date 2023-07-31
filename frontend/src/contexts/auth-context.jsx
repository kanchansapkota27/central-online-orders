import { createContext, useState } from 'react';
import axios from '../api/axios';


export const AuthContext = createContext(); 

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(sessionStorage.getItem('currentuser')?sessionStorage.getItem('currentuser'):null);
    const [token, setToken] = useState(sessionStorage.getItem('token')?sessionStorage.getItem('token'):null);
  
    const login = async (username, password) => {
        await axios.post('token/pair', {username, password})
          .then(response => {
            setUser(response?.data?.username);
            setToken(response?.data?.access);
            sessionStorage.setItem('token', response.data.access);
            sessionStorage.setItem('currentuser',response?.data?.username)
            
          })
      }
    
      const logout = () => {
        setUser(null);
        setToken(null);
        sessionStorage.clear()
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('currentuser')

      }
    
  const value = {
    user,
    token,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

