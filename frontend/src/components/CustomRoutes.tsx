import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import { AuthContext } from "../contexts/Auth";
import Form from "../pages/AuthUsers/Forms";
import ProfilePage from "../pages/AuthUsers/Profile";
import Default from "./Default";
import Dashboard from "../pages/AuthUsers/Dashboard";
import Details from "../pages/AuthUsers/Details"
import Landing from "../pages/Landing";

export default () => {
  const authContext = useContext(AuthContext);

  const getRoutes = (): JSX.Element => {
    if (authContext.loading) return <div>loading...</div>; 
 
    // if the user is authenticated then
    if (authContext.authenticated) {

      const CSIMenu = [
        { name: "Forms", link: "/" },
        { name: "Dashboard", link: "/dashboard" },
        { name: "Profile", link: "/profile" },

      ];
      const userMenu = [
        { name: "Dashboard", link: "/" },
        { name: "Profile", link: "/profile" },

      ];
      
      if  (authContext.role == "CSI") {
          return (
            <Default menu={CSIMenu}>
              <Routes>
                <Route path="/" element={<Form />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/details/:evidenceId" element={<Details />} /> // new route for details page
              </Routes>
            </Default>
          );
      } else {
        //  if the user in not CSI 
        return (
          <Default menu={userMenu}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/details/:evidenceId" element={<Details />} /> // new route for details page

            </Routes>
          </Default>
        );
      }
    } else {
    // if the user is not authenticated
      return (
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      );
    }
  };

  return getRoutes();
};
