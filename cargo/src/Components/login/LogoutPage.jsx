import { useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import DataContext from "../../Contexts/DataContext";
import { logout } from "../../Functions/auth";

function LogoutPage({ setRoleChange }) {
   const { makeMsg } = useContext(DataContext);
   useEffect(() => {
     logout();
     setRoleChange(Date.now());
     makeMsg('We hope you will come back soon! :)', 'info');
   }, [setRoleChange, makeMsg]);
 
   return <Navigate to="/login" replace />;
 }

 export default LogoutPage;