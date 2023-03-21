import Axios from 'axios'
import React, { useState } from 'react'
import '../../App.css';
import './MobileStyles.css';
import { API } from '../../constants';
import Allen from '../../assets/logo/Allen';
import { useAppDispatch } from '../../hooks/Actions';
import { setUser } from '../../hooks/slices/userSlice';
import { Header } from '../../components/Header';

interface Props {
  setAuthenticated: any,
  setVerified: any
}

const unknownErrors = ['Some moof milker put a compressor on the ignition line.',
  'I got a bad feeling about this.',
  'Laugh it up, Fuzzball',
  'INCONCEIVABLE!!!',
  'These aren\'t the droids you\'re looking for.', 'What a piece of junk.']

const MobileLogin: React.FC<Props> = (props: Props) => {
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState({ type: '', message: '' })
  const [errorHighlights, setErrorHighlights] = useState<string[]>([])
  
  const dispatch = useAppDispatch()

  const signUp = async () => {
    if (name === '' || company === '' || confirmPassword === '') {
      setErrorMessage({ type: 'signup', message: 'signup needs purple starred fields' });
      setErrorHighlights(['email', 'password', 'confirmPassword', 'name', 'company'])
    }
    else if (password !== confirmPassword) {
      setErrorMessage({ type: 'signup', message: 'passwords do not match' });
      setErrorHighlights(['password', 'confirmPassword'])
    } else {
      Axios.post(`${API}/user/signup`, {
        name: name,
        email: email.trim(),
        company: company,
        password: password
      }).then(res => {
        localStorage.setItem('token', res.data.token)
        dispatch(setUser(res.data.user));
        props.setAuthenticated(true)
      }).catch(err => {
        if (err.response?.data?.message) {
          setErrorMessage({ type: 'signup', message: err.response?.data?.message })
          if(err.response.status === 409) {
            setErrorHighlights(['email'])
          }
        } else {
          if (err.code === 'ERR_NETWORK') {
            setErrorMessage({type: 'global', message: 'network error, please try again later'})
          } else {
            setErrorMessage({type: 'global', message: unknownErrors[Math.floor(Math.random()*unknownErrors.length)]})
          }
        }
      })
    }
  }

  const login = () => {
    Axios.post(`${API}/user/login`, {
      email: email.trim(),
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
      console.log(err.response?.data?.message)
      if (err.response?.data?.message) {
        setErrorMessage({ type: 'login', message: err.response?.data?.message })
        if (err.response.status === 401) {
          setErrorHighlights(['email', 'password'])
        }
      } else {
        if (err.code === 'ERR_NETWORK') {
          setErrorMessage({type: 'global', message: 'network error, please try again later'})
        } else {
          setErrorMessage({type: 'global', message: unknownErrors[Math.floor(Math.random()*unknownErrors.length)]})
        }
      }
    })
  }

  const onSubmit = (e: any) => {
    setErrorHighlights([]);
    e.preventDefault();
    if (email !== '' && !email.match(/^[A-Za-z0-9]+\.+[A-Za-z0-9]+@chamonix\.com\.au$/)) {
      setErrorMessage({ type: 'global', message: 'invalid email format' })
      setErrorHighlights(['email'])
    } else if (name === '' && email === '' && company === '' && password === '' && confirmPassword === '') {
      setErrorMessage({ type: 'global', message: 'form must be filled!' });
      setErrorHighlights(['email','password','name','company','confirmPassword']);
    } else if (e.nativeEvent.submitter.name === 'login' || (email !== '' && password !== '' && name === '' && company === '' && confirmPassword === '')) {
      login();
    } else {
      signUp();
    }
  }

  return (
    <div className="mobile">
      <Header type='mobile' showGithub={false} />
      <div style={{justifyContent: 'space-between', flexDirection: 'column', display: 'flex', marginTop: '2rem', marginBottom: '2rem'}}>
        <Allen height={100} className='purple'/>
        <span style={{color: '#5900B2', fontSize: 18, marginTop: 15}}>Welcome to frome_road</span>
      </div>
      <div className='body'>
        <form style={{ width: '100%' }} onSubmit={onSubmit}>
          <div className='inputDiv'>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <span className='label'>email</span> <span style={{ color: '#8205ff' }}>*</span><span style={{ color: '#FFB405' }}>*</span>
            </div>
            <input type={'text'} className='input' style={{borderColor: (errorHighlights.includes('email') ? '#ff0000' : '#8205ff')}} value={email} onChange={(e) => setEmail(e.target.value)}/>
          </div>
          <div className='inputDiv'>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <span className='label'>password</span> <span style={{color: '#8205ff'}}>*</span><span style={{color: '#FFB405'}}>*</span>
            </div>
              <input type={'password'} className='input' style={{borderColor: (errorHighlights.includes('password') ? '#ff0000' : '#8205ff')}} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className='inputDiv'>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <span className='label'>name</span> <span style={{color: '#8205ff'}}>*</span>
            </div>
            <input className='input' style={{borderColor: (errorHighlights.includes('name') ? '#ff0000' : '#8205ff')}} value={name} onChange={(e) => setName(e.target.value)}/>
          </div>
          <div className='inputDiv'>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <span className='label'>company</span> <span style={{color: '#8205ff'}}>*</span> 
            </div>
            <input className='input' style={{borderColor: (errorHighlights.includes('company') ? '#ff0000' : '#8205ff')}} value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>
          <div className='inputDiv'>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <span className='label'>confirm password</span> <span style={{color: '#8205ff'}}>*</span>
            </div>
            <input type={'password'} className='input' style={{borderColor: (errorHighlights.includes('confirmPassword') ? '#ff0000' : '#8205ff')}} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
          <p style={{fontSize: 14, width: '100%', textAlign: 'center', color: 'red'}}>{errorMessage.message}</p>
          <div className='buttonDiv'>
            <button type='submit' className='button' name='signup'>
              sign up
              <span style={{color: '#8205ff', marginLeft: 5}}>*</span><span style={{color: '#FFB405'}}>*</span>
            </button>
            <button type='submit' className='button' name='login'>
              login
              <span style={{color: '#FFB405', marginLeft: 5}}>*</span>
            </button>
          </div>
        </form>
        <div>
          <div className='aboutDiv'>
            <div className='titleDiv'>
              <p className='sectionTitle'>about</p>
              <hr className='line'/>
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

export default MobileLogin
