import { useEffect, useState, } from 'react'
import './App.css';
import Axios from 'axios';
import Home from './screens/Home';
import { initialState, setUser } from './redux/slices/userSlice';
import { useAppDispatch } from './redux/Actions';
import { isMobile } from 'react-device-detect';
import { API } from './constants';
import Login from './screens/Login';
import Hamster from './assets/svg/hamster';
import MobileLogin from './screens/mobile/MobileLogin';
import MobileHome from './screens/mobile/MobileHome';
import { setIsOpen } from './redux/slices/sidebarSlice';


function App() {
  const dispatch = useAppDispatch();
  const [authenticated, setAuthenticated] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('token') && localStorage.getItem('token') !== '') {
      setAuthenticated(true)
    }
    getUserFromToken()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getUserFromToken = () => {
    Axios.get(`${API}/user/autoLogin`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => {
      dispatch(setUser(res.data[0]));
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
    dispatch(setUser(initialState));
    dispatch(setIsOpen(false));
  }


  if (authenticated && checked && !isMobile) {
    return (
      <Home logout={logout}></Home>
    );
  } else if (!authenticated && checked && !isMobile) {
    return (
      <Login setAuthenticated={setAuthenticated}></Login>
    );
  } else if (authenticated && checked && isMobile) {
    return (
      <MobileHome logout={logout}></MobileHome>
    );
  } else if (!authenticated && checked && isMobile) {
    return (
      <MobileLogin setAuthenticated={setAuthenticated}></MobileLogin>
    );
  } else {
    return (
      <div className='hamsterPage'>
        <Hamster height={200} width={200} fill={'#8205FF'} />
      </div>
      
    )
  }

}

export default App;
