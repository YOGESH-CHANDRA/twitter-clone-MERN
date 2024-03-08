import axios from "axios";
import { useState, createContext, useContext, useEffect } from "react";

// Creating a context for authentication
const AuthContext = createContext();

// Authentication provider component
const AuthProvider = ({ children }) => {
  // Setting up the initial state for authentication
  const [auth, setAuth] = useState({
    user: "",
    token: "",
  });

  // Setting the default base URL and common header for axios requests
  axios.defaults.baseURL = "https://twitter-clone-mern.onrender.com";

  axios.defaults.headers.common = { Authorization: `Bearer ${auth?.token}` };
  useEffect(() => {
    // Retrieving authentication data from local storage
    const data = JSON.parse(localStorage.getItem("auth"));
    console.log(data)
    if (data) {
      setAuth({ user: data.user, token: data.token });
    }
  }, []);

  // Providing the auth state and setAuth function to the child components through the context
  return (
    <AuthContext.Provider value={{auth, setAuth}}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
