import { useRouteError } from "react-router-dom";
import React from 'react'
import { useAppSelector } from "./hooks/Actions";
import Axios from "axios";
import { API } from "./constants";

interface Props {
  errorMessage: string
} 

export const ErrorPage: React.FC<Props> = (props: Props) => {
  const error: any = useRouteError();
  console.error(error ? error : props.errorMessage);
  const selector = useAppSelector(state => state);

  const sendVerification = () => {
    const params = {
      userID: selector.user.userID,
      name: selector.user.name,
      email: selector.user.email,
    }
    Axios.put(`${API}/verify/reverify`, params, {
      headers:
        { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).catch(err => {
      alert('error: ' + err.response.status)
    })
  }

  if (props.errorMessage && props.errorMessage !== '') {
    return (
      <div id="error-page">
        <h1>Oops!</h1>
        <p>{props.errorMessage}</p>
        <button onClick={() => sendVerification()}>send verification email</button>
      </div>
    )
  }

  else {
    return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
  }

}