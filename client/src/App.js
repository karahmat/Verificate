import React, {createContext, useState, useEffect} from 'react';
import Navbar from './components/Navbar';
import Explore from './pages/Explore';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SubmitDoc from './pages/SubmitDoc';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import SendPhrase from './pages/SendPhrase';
import {Switch, Route} from 'react-router';

export const UserContext = createContext();

function App() {
  const [userData, setUserData] = useState({        
    userId: '',
    email: '',
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
      const data = await response.json()

      if (data.userId) {
        setUserData(data)        
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
            <Explore />
          </Route>
          <Route path='/dashboard'>
            <Dashboard />
          </Route>
          <Route path='/settingPage'>
            <Settings />
          </Route>
          <Route path='/submitDoc'>
            <SubmitDoc />
          </Route>
          <Route path='/signup'>
            <SignupPage login={login} setLogin={setLogin} />
          </Route>
          <Route path='/login' >
            <LoginPage setLogin={setLogin} />
          </Route>
          <Route path='/profile' >
            <Profile />
          </Route>
          <Route path='/sendPhrase' >
            <SendPhrase />
          </Route>
        </Switch> 
      </UserContext.Provider>        
    </div>
  );
}

export default App;
