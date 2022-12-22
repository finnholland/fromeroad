import Axios from 'axios'
import React, { useState } from 'react'

const Login = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const signUp = () => {
    if (password !== confirmPassword || password === '' || !password) {
      alert('passowrds no matchy');
      return;
    }
    Axios.post('http://localhost:9000/user/createUser', {
      name: name,
      email: email,
      company: company,
      password: password
    }).then(res => {
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
      <button onClick={() => signUp()}>log in</button>
      <button onClick={() => signUp()}>log in</button>
      
    </div>

  )
}

export default Login
