import { useEffect, useState, } from 'react'
import './App.css';
import Axios from 'axios';
import Home from './screens/Home';
import { userInitialState, setUser } from './hooks/slices/userSlice';
import { useAppDispatch, useAppSelector } from './hooks/Actions';
import { isMobile } from 'react-device-detect';
import { API } from './constants';
import Login from './screens/Login';
import Allen from './assets/logo/Allen';
import MobileLogin from './screens/mobile/MobileLogin';
import MobileHome from './screens/mobile/MobileHome';
import { setIsOpen } from './hooks/slices/sidebarSlice';
import { ErrorPage } from './Error';
import { setDarkMode } from './hooks/slices/settingsSlice';
import { decrypt } from './hooks/crypto';


function App() {
  const dispatch = useAppDispatch();
  const selector = useAppSelector(state => state);
  const [authenticated, setAuthenticated] = useState(false)
  const [checked, setChecked] = useState(false)
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('token') && localStorage.getItem('token') !== '') {
      setAuthenticated(true)
    }
    dispatch(setDarkMode(localStorage.getItem('darkMode') === "true"))
    getUserFromToken()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getUserFromToken = () => {
    Axios.get(`${API}/user/autoLogin`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => {
      res.data[0].phone = decrypt(res.data[0].phone);
      dispatch(setUser(res.data[0]));
      setVerified(res.data[0].verified)
      setAuthenticated(true);
      setChecked(true)
    }).catch(err => {
      setAuthenticated(false)
      setChecked(true)
    })
  }

  const logout = () => {
    setAuthenticated(false);
    localStorage.removeItem('token');
    dispatch(setUser(userInitialState));
    dispatch(setIsOpen(false));
  }

  if (checked && !verified && authenticated) {
    return <ErrorPage logout={logout} errorMessage={`Your email isn't verified yet!\nVerify then reload the page :)`}/>
  }
  else if (authenticated && checked && !isMobile) {
    return (
      <Home logout={logout}></Home>
    );
  } else if (!authenticated && checked && !isMobile) {
    return (
      <Login setVerified={setVerified} setAuthenticated={setAuthenticated}></Login>
    );
  } else if (authenticated && checked && isMobile) {
    return (
      <MobileHome logout={logout}></MobileHome>
    );
  } else if (!authenticated && checked && isMobile) {
    return (
      <MobileLogin setVerified={setVerified} setAuthenticated={setAuthenticated}></MobileLogin>
    );
  } else {
    return (
      <div className={selector.settings.darkMode ? 'allenPageDarkMode' : 'allenPage'}>
        <Allen height={200} width={200} className='purple'/>
      </div>
      
    )
  }

}

export default App;
