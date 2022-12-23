import Axios from 'axios'
import React, { useState } from 'react'
import { Link } from "react-router-dom";


const Login = () => {
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const signUp = async () => {
    if (password !== confirmPassword || password === '' || !password) {
      alert('passowrds no matchy');
      return;
    }
    if (name === '' || email === '' || company === '') {
      alert('form must be filled!');
      return;
    }
    Axios.post('http://localhost:9000/user/signup', {
      name: name,
      email: email,
      company: company,
      password: password
    }).catch(function (error) {
      console.log(error)
    }).then((res) => {
      console.log(res)
    })
  }

  const login = async () => {
    Axios.post('http://localhost:9000/user/login', {
      email: email,
      password: password
    }).then(res => {
      if (res.status !== 200) {
        alert('incorrect email or password')
      } else {
        // <Link to={`/`}>Your Name</Link>
      }
      localStorage.setItem('token', res.data.token)
      console.log(res)
    })
  }

  const getTest = async () => {
    Axios.get('http://localhost:9000/user/2', {
      headers: {
        authorisation: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => {
      if (res.status !== 200) {
        alert('incorrect email or password')
      }
      console.log(res)
    })
  }

  return (
    <div>
      <input placeholder='Name' value={name} onChange={(e) => setName(e.target.value)}/>
      <input placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}/>
      <input placeholder='Company' value={company} onChange={(e) => setCompany(e.target.value)} />
      <input placeholder='Password'value={password} onChange={(e) => setPassword(e.target.value)} />
      <input placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      <button onClick={() => signUp()}>sign up</button>
      <button onClick={() => login()}>log in</button>
      <button onClick={() => getTest()}>test</button>
      
    </div>

  )
}

export default Login
