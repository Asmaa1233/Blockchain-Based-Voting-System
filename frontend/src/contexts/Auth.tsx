import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "../axios";

type ContextProps = {
  children: JSX.Element;
};

type User = {
  index: number;
  id: string;
  name: string;
  role: string;
  email: string;
};

export const AuthContext = createContext({
  index: 0,
  name: "",
  id: "",
  role: "",
  email: "",
  authenticated: false,
  accessToken: "",
  loading: true,
  authenticate: (user: User, token: string) => {},
  logout: () => {},
});

export default (props: ContextProps): JSX.Element => {
  const navigate = useNavigate();

  const [authentication, setAuthentication] = useState({
    index: 0,
    name: "",
    id: "",
    role: "",
    email: "",
    authenticated: false,
    accessToken: "",
    loading: true,
  });

  const checkAuthentication = () => {
    axios
      .post("/auth/check")
      .then((res) => authenticate(res.data.user, res.data.accessToken, false))
      .catch((error) => {
        setAuthentication({ ...authentication, loading: false });
      });
  };

  useEffect(() => {
    checkAuthentication();
    const interval = setInterval(checkAuthentication, 5 * 1000);
    return () => clearInterval(interval);
  }, []);

  const authenticate = (
    user: User,
    token: string,
    redirect: boolean = true
  ) => {
    setAuthentication({
      index: user.index,
      name: user.name,
      id: user.id,
      role: user.role,
      email: user.email,
      authenticated: true,
      accessToken: token,
      loading: false,
    });

    if (redirect) navigate("/");
  };

  const logout = async () => {
    await axios.post("/auth/logout");

    setAuthentication({
      index: 0,
      name: "",
      id: "",
      role: "",
      email: "",
      authenticated: false,
      accessToken: "",
      loading: false,
    });

    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        index: authentication.index,
        name: authentication.name,
        id: authentication.id,
        role: authentication.role,
        email: authentication.email,
        authenticated: authentication.authenticated,
        accessToken: authentication.accessToken,
        loading: authentication.loading,
        authenticate,
        logout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
