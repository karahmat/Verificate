import React, {createContext, useState, useEffect} from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Explore from './pages/Explore';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SubmitDoc from './pages/SubmitDoc';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import SendPhrase from './pages/SendPhrase';
import VerifyDoc from './pages/VerifyDoc';
import Homepage from './pages/Homepage';
import {Switch, Route, Redirect} from 'react-router';
import { useCookies } from 'react-cookie';

export const UserContext = createContext();

function App() {
  const [cookie, setCookie] = useCookies(['isLoggedIn']);
  console.log("cookies", cookie.isLoggedIn);
  const [userData, setUserData] = useState({        
    userId: '',
    email: '',
    domain: '',
    domainValidated: '',
    issuer: '',
    contractAddress: '',
    walletAddress: ''    
  });

  const [login, setLogin] = useState(false)

  useEffect(() => {
    //const session = isAuthenticated()
    const getUserData = async () => {      
      const response = await fetch(`/api/users/jwt`, {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
      })
      const data = await response.json();      

      if (data.userId) {
        setUserData(data);
      } else if (data.errors) {
        setUserData(data.errors)
      }
    }

    getUserData()
    
    return function cleanup() {
      setUserData({})
    }
  }, [login])

  

  return (

    <div className="App">
      <UserContext.Provider value={userData}>
        <Navbar />       
        <Switch>
          <Route exact={true} path='/'>
            <Homepage />
          </Route>
          <Route path='/explore'>
            <Explore />
          </Route>
          <Route path='/signup'>
            <SignupPage login={login} setLogin={setLogin} />
          </Route>
          <Route path='/login' >
            <LoginPage setLogin={setLogin} />
          </Route>
          <Route path='/documents/:testnet/:txnHash'>
            <VerifyDoc />
          </Route>
          <Route path='/sendPhrase'>
            <SendPhrase />
          </Route>
          <Route path='/profile'>
            <Profile />
          </Route>
          
          {cookie.isLoggedIn && 
          <>
          
          <Route path='/submitDoc'>
            <SubmitDoc />
          </Route>
          <Route path='/dashboard'>
            <Dashboard />
          </Route>
          <Route path='/settingPage'>
            <Settings />
          </Route>
          
          </>
          }            
          
          <Redirect to='/login' />
        </Switch> 
        <Footer />
      </UserContext.Provider>        
    </div>
  );
}

export default App;
