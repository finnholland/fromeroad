import { useRouteError } from "react-router-dom";
import React, { useState } from 'react'
import { useAppSelector } from "./hooks/Actions";
import Axios from "axios";
import { API } from "./constants";
import { Header } from "./components/Header";
import { isMobile } from "react-device-detect";

interface Props {
  errorMessage: string,
  logout: any
} 

export const ErrorPage: React.FC<Props> = (props: Props) => {
  const error: any = useRouteError();
  console.error(error ? error : props.errorMessage);
  const selector = useAppSelector(state => state);

  const [statusMessage, setStatusMessage] = useState({code: 0, message: ''})

  const sendVerification = () => {
    const params = {
      userID: selector.user.userID,
      name: selector.user.name,
      email: selector.user.email,
    }
    Axios.put(`${API}/verify/reverify`, params).then(res => {
      setStatusMessage({ code: 200, message: res.data.message })
    }).catch(err => {
      setStatusMessage({ code: 500, message: 'failed to resend email, please try again later' })
    })
  }

  if (props.errorMessage && props.errorMessage !== '' && props.errorMessage.toLowerCase().includes('verify')) {
    return (
      <div className="app">
        <Header showGithub={false} error={true} />
        <div id="error-page" style={{padding: 20, paddingTop: isMobile ? 100 : 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div>
            <h1>Oops!</h1>
            <p>{props.errorMessage}</p>
            <button style={{ width: '100%', backgroundColor: '#5900B2', border: 0, padding: 10, color: 'white', fontSize: 16, borderRadius: 10, cursor: 'pointer' }} onClick={() => sendVerification()}>send verification email</button>
            <div style={{ flexDirection: 'row', justifyContent: 'space-between', display: 'flex'}}>
              <button style={{ flex: 1, backgroundColor: '#5900B2', border: 0, padding: 10, color: 'white', fontSize: 16, borderRadius: 10, cursor: 'pointer', marginTop: 20, marginRight: 10}} onClick={() => window.location.reload()}>refresh</button>
              <button style={{ flex: 1, backgroundColor: '#5900B2', border: 0, padding: 10, color: 'white', fontSize: 16, borderRadius: 10, cursor: 'pointer', marginTop: 20, marginLeft: 10}} onClick={() => props.logout()}>logout</button>     
            </div>
            <p className={statusMessage.code === 200 ? 'successMessage' : 'errorMessage'}>{statusMessage.message}</p>
          </div>
        </div>
      </div>
    )
  }

  else {
    return (
      <div id="error-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div>
          <h1>Oops!</h1>
          <p>Sorry, an unexpected error has occurred.</p>
          <p>
            <i>{error.statusText || error.message}</i>
          </p>
        </div>
      </div>
    );
  }
}