import React, { useContext } from "react";
import { RouteProps } from "react-router";
import { AuthContext } from "../../contexts/Auth";

const Profile = (props: RouteProps) => {
  const authContext = useContext(AuthContext);

  return (
    <div className="profile-wrapper">

            <div className="left-panel">
                  <div className="person-icon"> <i className="bi bi-person-circle"></i> </div>
                  <div className="profileName"> {authContext.name}</div>
            </div>
            <div className="right-panel">
                  <div className="text"> <b>ID:</b>  {authContext.id}</div>
                  <div className="text"> <b>Email: </b>  {authContext.email}</div>
                  <div className="text"><b>Role: </b>  {authContext.role}</div>
            </div>

            <button onClick={authContext.logout} className="button-primary"> Logout </button>
    </div>
  );
};

export default Profile;
