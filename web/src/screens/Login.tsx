import Axios from 'axios'
import React, { useState } from 'react'
import '../App.css';
import './Login.css';
import { API } from '../constants';
import { useAppDispatch } from '../hooks/Actions';
import { setUser } from '../hooks/slices/userSlice';
import { Header } from '../components/Header';
import Allen from '../assets/logo/Allen';

interface Props {
  setAuthenticated: any
  setVerified: any
}

const Login: React.FC<Props> = (props: Props) => {
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [formatErrorMessage, setFormatErrorMessage] = useState('')
  
  const dispatch = useAppDispatch()

  const signUp = async () => {
    if (email !== '' && !email.match(/^[A-Za-z0-9]+\.+[A-Za-z0-9]+@chamonix\.com\.au$/)) {
      setFormatErrorMessage('invalid email format')
    } else if (name === '' && company === '' && confirmPassword === '') {
      setErrorMessage('signup needs purple starred fields');
    }
    else if (password !== confirmPassword) {
      setErrorMessage('passwords do not match');
    } else if (password === '' || confirmPassword === '') {
      setErrorMessage('both passwords are required');
    } else {
      Axios.post(`${API}/user/signup`, {
        name: name,
        email: email,
        company: company,
        password: password
      }).then(res => {
        localStorage.setItem('token', res.data.token)
        dispatch(setUser(res.data.user));
        props.setAuthenticated(true)
      }).catch(err => {
        alert(err)
      })
    }
  }

  const login = () => {
    if (!email.match(/^[A-Za-z0-9]+\.+[A-Za-z0-9]+@chamonix\.com\.au$/)) {
      setErrorMessage('invalid email format')
    } else {
      Axios.post(`${API}/user/login`, {
        email: email,
        password: password
      }).then(res => {
        if (res.status !== 200) {
          alert(res.data)
          console.log(res.data)
        } else {
          localStorage.setItem('token', res.data.token)
        }
        dispatch(setUser(res.data.user));
        props.setVerified(res.data.user.verified)
        props.setAuthenticated(true)
      }).catch(err => {
        setErrorMessage(err.response.data.message)
      })
    }
  }

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (name === '' && email === '' && company === '' && password === '' && confirmPassword === '') {
      setErrorMessage('form must be filled!');
    } else if (name !== '' || company !== '' || confirmPassword !== '') {
      signUp()
    } else {
      login()
    }
  }

  return (
    <div className="app">
      <Header type='desktop' showGithub={false} />
      <div className='welcome'>
        <Allen height={150} className='purple'/>
        <span style={{color: '#5900B2', fontSize: 18, marginTop: 15}}>Welcome to frome_road</span>
      </div>
      <div className='body'>
        <div style={{flex: 1}}>

        </div>
        <div style={{flex: 1}}>
          <form style={{width: '100%'}} onSubmit={onSubmit}>
            <div className='inputDiv'>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <span className='label'>name</span> <span style={{color: '#8205ff'}}>*</span>
              </div>
              <input className='input' value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
            <div className='inputDiv'>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <span className='label'>email</span> <span style={{ color: '#8205ff' }}>*</span><span style={{ color: '#FFB405' }}>*</span><span>{formatErrorMessage}</span>
              </div>
              <input type={'email'} className='input' value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className='inputDiv'>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <span className='label'>company</span> <span style={{color: '#8205ff'}}>*</span> 
              </div>
              <input className='input' value={company} onChange={(e) => setCompany(e.target.value)} />
            </div>
            <div className='inputDiv'>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <span className='label'>password</span> <span style={{color: '#8205ff'}}>*</span><span style={{color: '#FFB405'}}>*</span>
              </div>
                <input type={'password'} className='input' value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className='inputDiv'>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <span className='label'>confirm password</span> <span style={{color: '#8205ff'}}>*</span>
              </div>
              <input type={'password'} className='input' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <div className='buttonDiv'>
              <button className='button'>
                sign up
                <span style={{color: '#8205ff', marginLeft: 5}}>*</span><span style={{color: '#FFB405'}}>*</span>
              </button>
              <button type='submit' className='button'>
                login
                <span style={{color: '#FFB405', marginLeft: 5}}>*</span>
              </button>
            </div>
            <span style={{fontSize: 14, justifySelf: 'flex-end'}}>{errorMessage}</span>
          </form>
        </div>
        <div style={{ flex: 1 }}>
          <div className='aboutDiv'>
            <div className='titleDiv'>
              <p className='sectionTitle'>about</p>
              <hr className='line' />
            </div>
            <span className='aboutText'>
              frome_road is a space for all employees of Lot Fourteen to discuss anything from tech to the weather.
            </span>
            <span className='aboutText'>
              The site is currently only available to employees of Chamonix.
            </span>
            <div className='titleDiv' style={{marginTop: '2rem'}}>
              <p className='sectionTitle'>creator</p>
              <hr className='line' />
            </div>
              <p className='aboutText' style={{marginTop: 0}}>I originally created this project as a way to get into full-stack devving.</p>
              <p className='aboutText'>The project stack is ReactJS, NodeJS, and MySQL, hosted on AWS Amplify with a dedicated server.</p>
              <p className='aboutText'>I honestly have no idea if it'll work or how many bugs there'll be so please don't hesitate to report them.</p>
              <p className='aboutText'>You can access the repo once logged in and verified :)</p>
              
          </div>
        </div>
      </div>      
    </div>
  )
}

export default Login
