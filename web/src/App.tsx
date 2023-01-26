import { useEffect, useState, } from 'react'
import './App.css';
import Axios from 'axios';
import Home from './screens/Home';
import { setUser } from './redux/slices/userSlice';
import { useAppDispatch } from './redux/Actions';
import { useNavigate } from 'react-router-dom';
import { API } from './constants';
import Login from './screens/Login';
import Hamster from './assets/svg/hamster';


function App() {
  const dispatch = useAppDispatch();
  const [authenticated, setAuthenticated] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('token') && localStorage.getItem('token') !== '') {
      setAuthenticated(true)
    }
    getUserFromToken()
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


  if (authenticated && checked) {
    return (
      <Home setAuthenticated={setAuthenticated}></Home>
    );
  } else if (!authenticated && checked) {
    return (
      <Login setAuthenticated={setAuthenticated}></Login>
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
