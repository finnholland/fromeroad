import Axios from 'axios'
import React, { useState } from 'react'
import '../App.css';
import './Login.css';
import SvgChamonix from '../assets/svg/chamonix';
import SvgLotfourteen from '../assets/svg/lotfourteen';
import { useNavigate } from 'react-router-dom';
import { API } from '../constants';
import Hamster from '../assets/svg/hamster';
import { useAppDispatch } from '../redux/Actions';
import { setUser } from '../redux/slices/userSlice';


const Login = () => {
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const dispatch = useAppDispatch()
  const navigate = useNavigate();

  const signUp = async () => {
    if (!email.match(/^[A-Za-z0-9]+\.+[A-Za-z0-9]+@chamonix\.com\.au$/)) {
      alert('invalid email format')
    }
    else if (password !== confirmPassword || password === '' || !password) {
      alert('passowrds no matchy');
    }
    else if (name === '' || email === '' || company === '') {
      alert('form must be filled!');
    } else {
      Axios.post(`${API}/user/signup`, {
        name: name,
        email: email,
        company: company,
        password: password
      }).then(res => {
        dispatch(setUser(res.data.user));
        navigate("../", { replace: true });
      }).catch(err => {
        alert(err)
      })
    }
  }

  const login = () => {
    if (!email.match(/^[A-Za-z0-9]+\.+[A-Za-z0-9]+@chamonix\.com\.au$/)) {
      alert('invalid email format')
    } else {
      Axios.post(`${API}/user/login`, {
        email: email,
        password: password
      }).then(res => {
        if (res.status !== 200) {
          alert('incorrect email or password')
        } else {
          localStorage.setItem('token', res.data.token)
        }
        dispatch(setUser(res.data.user));
        navigate("../", { replace: true });
      })
    }
  }

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (confirmPassword !== '') {
      signUp()
    } else {
      login()
    }
  } 

  return (
    <div className="app">
      <header className="header">
        <a href='http://www.lotfourteen.com.au' className='lotfourteen'>
          <SvgLotfourteen height={25} />
        </a>

        <div className='titleContainer'>
          <p className='title'>fromeroad</p>
        </div>
        <a href='http://www.chamonix.com.au' className='chamonix' style={{ justifyContent: 'flex-end' }}>
          <SvgChamonix height={20}/>
        </a>
        
      </header>
      <div className='body'>
        <Hamster height={150} fill={'#00eded'} />
        <form style={{width: '30%'}} onSubmit={onSubmit}>
          <div className='inputDiv'>
            <span className='label'>name</span>
            <input className='input' value={name} onChange={(e) => setName(e.target.value)}/>
          </div>
          <div className='inputDiv'>
            <span className='label'>email</span>
            <input className='input' value={email} onChange={(e) => setEmail(e.target.value)}/>
          </div>
          <div className='inputDiv'>
            <span className='label'>company</span>
            <input className='input' value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>
          <div className='inputDiv'>
            <span className='label'>password</span>
            <input className='input' value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className='inputDiv'>
            <span className='label'>confirm password</span>
            <input className='input' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
          <div className='buttonDiv'>
          <button className='button'>
              sign up
            </button>
          <button type='submit' className='button'>
              login
            </button>
          </div>
        </form>
      </div>
    </div>

  )
}

export default Login
