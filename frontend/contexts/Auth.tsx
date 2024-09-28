import axios, { AxiosError } from "axios";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface authI {
  loggedIn: boolean,
  loggedAt?: Date,
  user?: any
  login: (data: { email: string, password: string }) => Promise<void>,
  logout: () => Promise<void>,
}

const noAuth: authI = {
  loggedIn: false,
  login: async () => { },
  logout: async () => { }
}

const AuthContext = createContext(noAuth)

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loggedAt, setLoggedAt] = useState(new Date(0));

  const login = async (data: { email: string, password: string }) => {
    return axios.post("/api/users/login", data).then(
      (res) => {
        setUser(res.data);
        setLoggedIn(true)
        setLoggedAt(new Date())
      }
    )
  };

  const logout = async () => {
    setLoggedIn(false)
    setLoggedAt(new Date(0))
    setUser(null);
    return axios.post("/api/users/logout")
      .then(() => { })
  };

  // try login with jwt cookie
  useEffect(() => {
    login({ email: "", password: "" }).catch(() => { })
  }, [])

  return (
    <AuthContext.Provider value={{ loggedIn, loggedAt, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );

};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthContext };

