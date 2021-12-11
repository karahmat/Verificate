import React from "react";
import { useCookies } from 'react-cookie';
import { Redirect, Route } from "react-router-dom";

function ProtectedRoute({ component: Component, ...restOfProps }) {
    const [cookie, setCookie] = useCookies(['isLoggedIn']);
    console.log("cookies", cookie.isLoggedIn)
    
  return (
      
    <Route
     
      {...restOfProps}
      render={(props) =>
        (cookie.isLoggedIn === true) ? <Component {...props} /> : <Redirect to="/login" />
      }
    >
        
    </Route>
    
  );
}

export default ProtectedRoute;