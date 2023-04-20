import Axios from 'axios'
import React, { useState } from 'react'
import '../App.css';
import './Login.css';
import { API } from '../constants';
import { useAppDispatch } from '../hooks/Actions';
import { setUser } from '../hooks/slices/userSlice';
import { Header } from '../components/Header';
import Allen from '../assets/logo/Allen';
import ReactCodeInput from 'react-code-input';
import { changePassword, findUserByEmail, updateCode, validateCode, validatePasswords } from '../hooks/login/loginFunctions';
import AboutDiv from '../components/Login/About';

interface Props {
  setAuthenticated: any
  setVerified: any
}

const unknownErrors = ['Some moof milker put a compressor on the ignition line.',
  'I got a bad feeling about this.',
  'Laugh it up, Fuzzball',
  'INCONCEIVABLE!!!',
  'These aren\'t the droids you\'re looking for.', 'What a piece of junk.']

const Login: React.FC<Props> = (props: Props) => {
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [code, setCode] = useState('')
  const [errorMessage, setErrorMessage] = useState({ type: '', message: '' })
  const [errorHighlights, setErrorHighlights] = useState<string[]>([])
  const [resetting, setResetting] = useState(false);
  const [validCode, setValidCode] = useState("#8205ff");
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [codeSentMessage, setCodeSentMessage] = useState('get code');
  
  
  const dispatch = useAppDispatch()

  const signUp = async () => {
    if (name === '' || company === '' || confirmPassword === '') {
      setErrorMessage({ type: 'signup', message: 'signup needs purple starred fields' });
      setErrorHighlights(['email', 'password', 'confirmPassword', 'name', 'company'])
    } else if (validatePasswords({ password, confirmPassword, setErrorHighlights, setErrorMessage })) {
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
          if (err.response.status === 409) {
            setErrorHighlights(['email'])
          }
        } else {
          if (err.code === 'ERR_NETWORK') {
            setErrorMessage({ type: 'global', message: 'network error, please try again later' })
          } else {
            setErrorMessage({ type: 'global', message: unknownErrors[Math.floor(Math.random() * unknownErrors.length)] })
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
      localStorage.setItem('token', res.data.token)
      dispatch(setUser(res.data.user));
      props.setVerified(res.data.user.verified)
      props.setAuthenticated(true)
    }).catch(err => {
      if (err.response?.data?.message) {
        setErrorMessage({ type: 'login', message: err.response?.data?.message })
        if (err.response.status === 401) {
          setErrorHighlights(['email', 'password'])
        }
      } else {
        if (err.code === 'ERR_NETWORK') {
          setErrorMessage({ type: 'global', message: 'network error, please try again later' })
        } else {
          setErrorMessage({ type: 'global', message: unknownErrors[Math.floor(Math.random() * unknownErrors.length)] })
        }
      }
    })
  }

  const onSubmit = (e: any) => {
    setErrorHighlights([])
    e.preventDefault();
    if (email !== '' && !email.match(/^[A-Za-z0-9]+\.+[A-Za-z0-9]+@chamonix\.com\.au$/)) {
      setErrorMessage({ type: 'global', message: 'invalid email format' });
      setErrorHighlights(['email']);
    } else if (name === '' && email === '' && company === '' && password === '' && confirmPassword === '') {
      setErrorMessage({ type: 'global', message: 'form must be filled!' });
      setErrorHighlights(['email', 'password', 'name', 'company', 'confirmPassword']);
    } else if (e.nativeEvent.submitter.name === 'login' || (email !== '' && password !== '' && name === '' && company === '' && confirmPassword === '')) {
      login();
    } else {
      signUp();
    }
  }

  const onPasswordChange = (password: string, confirmPassword: string) => {
    setPassword(password);
    setConfirmPassword(confirmPassword);
    validatePasswords({ password, confirmPassword, setErrorHighlights, setErrorMessage });
  }

  const updateEmail = (value: string) => {
    setEmail(value.trim().toLowerCase());
    updateCode({ code, email, setCode, setValidCode, setErrorMessage,  setErrorHighlights });
    setCodeSentMessage('get code');
  }

  const toggleLoginOrReset = () => {
    setResetting(!resetting);
    setErrorMessage({ type: '', message: '' });
    setErrorHighlights([]);
    setPassword('');
    setConfirmPassword('');
    setEmail('');
    setValidCode("#8205ff")
    setCode('')
  }

  const codeStyle = {
    fontFamily: "monospace",
    borderRadius: "6px",
    border: `2px solid ${validCode}`,
    width: "46px",
    height: "46px",
    fontSize: "32px",
    color: "black",
    backgroundColor: "#f8f1ff",
    textAlign: "center" as "center"
  }

  if (resetting) {
    return (
      <div className="app">
        <Header showGithub={false} />
        <div className='welcome'>
          <Allen height={150} className='purple' />
          <span style={{ color: '#5900B2', fontSize: 18, marginTop: 15 }}>Welcome to frome_road</span>
        </div>
        <div className='body'>
          <div style={{ flex: 1 }} />
          <div style={{ flex: 1 }}>
            <div className='inputDiv'>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <span className='label'>email *</span>
              </div>
              <input type={'text'} className='input' style={{ borderColor: (errorHighlights.includes('email') ? '#ff0000' : '#8205ff') }} value={email} onChange={(e) => updateEmail(e.target.value)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <span className='label'>code *</span>
              <span className='label' onClick={() => findUserByEmail({ email, codeSentMessage, setCodeSentMessage, setErrorMessage, setErrorHighlights })} style={{ cursor: 'pointer' }}>{codeSentMessage}</span>
            </div>
            <ReactCodeInput type='number' fields={6} name={'resetCode'} inputMode='numeric' style={{alignItems: 'center'}} autoFocus={false} inputStyle={codeStyle} className='rci' onChange={(e) => updateCode({ code: e, email, setCode, setValidCode, setErrorMessage,  setErrorHighlights })} />
            <div className='inputDiv'>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <span className='label'>password *</span>
              </div>
              <input type={'password'} className='input' style={{ borderColor: (errorHighlights.includes('password') ? '#ff0000' : '#8205ff') }} value={password} onChange={(e) => onPasswordChange(e.target.value, confirmPassword)} />
            </div>
            <div className='inputDiv'>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <span className='label'>confirm password *</span>
              </div>
              <input type={'password'} className='input' style={{ borderColor: (errorHighlights.includes('confirmPassword') ? '#ff0000' : '#8205ff') }} value={confirmPassword} onChange={(e) => onPasswordChange(password, e.target.value)} />
            </div>
            <div className='buttonDiv'>
              <div style={{ width: '30%' }}>
                <button className='button' onClick={() => toggleLoginOrReset()}>
                  back
                </button>
              </div>
              <div style={{ width: '50%' }}>
                <button className='button' onClick={() => changePassword({password, confirmPassword, email, validCode, setShowSuccessPage, toggleLoginOrReset})}>
                  change password *
                </button>
                <p style={{ fontSize: 13, textAlign: 'end', color: 'red', marginTop: 5 }}>{errorMessage.type === 'signup' ? errorMessage.message : ''}</p>
              </div>
            </div>
            <p style={{ fontSize: 14, width: '100%', textAlign: 'center', marginTop: '2rem', color: 'red' }}>{errorMessage.type === 'global' ? errorMessage.message : ''}</p>
          </div>
          
          <div style={{ flex: 1 }}>
            <AboutDiv />
          </div>
        </div>
      </div>
    )
  } else if (showSuccessPage) {
    return (
      <div className="app">
        <Header showGithub={false} />
        <div className='welcome'>
          <Allen height={150} className='purple' />
          <span style={{ color: '#5900B2', fontSize: 18, marginTop: 15 }}>Welcome to frome_road</span>
        </div>
        <div className='body'>
          <div style={{ flex: 1 }} />
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', flexDirection: 'column', paddingTop: '1.25rem' }}>
            
            <span style={{ fontSize: 20, color: '#5900B2' }}>Success!</span>
            <span>your password has been updated</span>
            <div className='buttonDiv'>
              <div style={{ flex: 1 }}>
                <button className='button' onClick={() => setShowSuccessPage(false)}>
                  login
                </button>
              </div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <AboutDiv />
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="app">
        <Header showGithub={false} />
        <div className='welcome'>
          <Allen height={150} className='purple' />
          <span style={{ color: '#5900B2', fontSize: 18, marginTop: 15 }}>Welcome to frome_road</span>
        </div>
        <div className='body'>
          <div style={{ flex: 1 }} />
          <div style={{ flex: 1 }}>
            <form style={{ width: '100%' }} onSubmit={onSubmit}>

              <div className='inputDiv'>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <span className='label'>email *</span><span style={{ color: '#FFB405' }}>*</span>
                </div>
                <input type={'text'} className='input' style={{ borderColor: (errorHighlights.includes('email') ? '#ff0000' : '#8205ff') }} value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className='inputDiv'>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <span>
                    <span className='label'>password *</span><span style={{ color: '#FFB405' }}>*</span>
                  </span>
                  <span className='label' style={{ cursor: 'pointer' }} onClick={() => toggleLoginOrReset()}>forgot</span>
                </div>
                <input type={'password'} className='input' style={{ borderColor: (errorHighlights.includes('password') ? '#ff0000' : '#8205ff') }} value={password} onChange={(e) => onPasswordChange(e.target.value, confirmPassword)} />
              </div>
              <div className='inputDiv'>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <span className='label'>name *</span>
                </div>
                <input className='input' style={{ borderColor: (errorHighlights.includes('name') ? '#ff0000' : '#8205ff') }} value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className='inputDiv'>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <span className='label'>company *</span>
                </div>
                <input className='input' style={{ borderColor: (errorHighlights.includes('company') ? '#ff0000' : '#8205ff') }} value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>
              <div className='inputDiv'>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <span className='label'>confirm password *</span>
                </div>
                <input type={'password'} className='input' style={{ borderColor: (errorHighlights.includes('confirmPassword') ? '#ff0000' : '#8205ff') }} value={confirmPassword} onChange={(e) => onPasswordChange(password, e.target.value)} />
              </div>
              <div className='buttonDiv'>
                <div style={{ width: '40%' }}>
                  <button type='submit' className='button' name='signup'>
                    sign up
                    <span style={{ color: '#8205ff', marginLeft: 5 }}>*</span><span style={{ color: '#FFB405' }}>*</span>
                  </button>
                  <p style={{ fontSize: 13, color: 'red', marginTop: 5 }}>{errorMessage.type === 'signup' ? errorMessage.message : ''}</p>
                </div>
                <div style={{ width: '40%' }}>
                  <button type='submit' className='button' name='login'>
                    login
                    <span style={{ color: '#FFB405', marginLeft: 5 }}>*</span>
                  </button>
                  <p style={{ fontSize: 13, textAlign: 'end', color: 'red', marginTop: 5 }}>{errorMessage.type === 'login' ? errorMessage.message : ''}</p>
                </div>
              </div>
            </form>
            <p style={{ fontSize: 14, width: '100%', textAlign: 'center', marginTop: '2rem', color: 'red' }}>{errorMessage.type === 'global' ? errorMessage.message : ''}</p>
          </div>
          <div style={{ flex: 1 }}>
            <AboutDiv />
          </div>
        </div>
      </div>
    )
  }
}

export default Login
