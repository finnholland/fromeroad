import Axios from "axios"
import { API } from "../../constants"
import { Dispatch, SetStateAction } from "react"
import { encrypt } from "../crypto"

const generateCode = (email: string) => {
  Axios.post(`${API}/user/generateresetcode`, {
    email: email
  }).catch(err => {
    alert(err)
  })
}


interface FindUserByEmailProps {
  email: string,
  codeSentMessage: string,
  setCodeSentMessage: Dispatch<SetStateAction<string>>,
  setErrorMessage: Dispatch<SetStateAction<{ type: string, message: string }>>,
  setErrorHighlights: Dispatch<SetStateAction<string[]>>
}
export const findUserByEmail = (props: FindUserByEmailProps) => {
  props.email = props.email.trim().toLowerCase();
  if (props.email === '') {
    props.setErrorMessage({ type: 'global', message: 'enter a valid email to generate a code' });
    props.setErrorHighlights(['email']);
  } else if (props.codeSentMessage === 'code sent! - it may take a while') {
    // do nothing
  } else {
    Axios.get(`${API}/user/email`, {
      params: {
        email: props.email
      }
    }).then(res => {
      generateCode(props.email);
      props.setCodeSentMessage('code sent!');
      setTimeout(() => {
        props.setCodeSentMessage('send again?');
      }, 5000);
      
    }).catch(err => {
      props.setErrorMessage({ type: 'global', message: err.response?.data?.message });
      props.setErrorHighlights(['email']);
    })
  }
}


interface ChangePasswordProps {
  password: string,
  confirmPassword: string,
  email: string,
  validCode: string,
  setShowSuccessPage: Dispatch<SetStateAction<boolean>>,
  toggleLoginOrReset: any
}
export const changePassword = (props: ChangePasswordProps) => {
  const canResetPassword = props.password === props.confirmPassword && props.email.match(/^[A-Za-z0-9]+\.+[A-Za-z0-9]+@chamonix\.com\.au$/) && props.validCode === "#0f0"
  if (canResetPassword) {
    console.log(props.email)
    Axios.post(`${API}/user/resetpassword`, {
      password: encrypt(props.password),
      email: props.email.trim().toLowerCase()
    }).then(res => {
      props.setShowSuccessPage(true);
      props.toggleLoginOrReset();
    }).catch(err => {

    })
  }
}


interface ValidateCodeProps {
  code: string,
  email: string,
  setValidCode: Dispatch<SetStateAction<string>>,
  setErrorMessage: Dispatch<SetStateAction<{ type: string, message: string }>>,
  setErrorHighlights: Dispatch<SetStateAction<string[]>>
}
export const validateCode = (props: ValidateCodeProps) => {
  Axios.get(`${API}/user/validateresetcode`, {
    params: {
      email: props.email,
      resetCode: props.code
    },
  }).then(res => {
    props.setValidCode("#0f0");
    props.setErrorMessage({ type: '', message: '' });
    props.setErrorHighlights([]);
  }).catch(err => {
    if (err.response.status === 409) {
      props.setValidCode("#f00");
      props.setErrorMessage({ type: 'global', message: 'code is invalid or expired' });
    }
  })
}


interface UpdateCodeProps {
  code: string,
  email: string,
  setCode: Dispatch<SetStateAction<string>>,
  setValidCode: Dispatch<SetStateAction<string>>,
  setErrorMessage: Dispatch<SetStateAction<{ type: string, message: string }>>,
  setErrorHighlights: Dispatch<SetStateAction<string[]>>
}
export const updateCode = (props: UpdateCodeProps) => {
  props.setCode(props.code);
  if (props.email === '' && props.code.length === 6) {
    props.setErrorMessage({ type: 'global', message: 'code checking requires an email' });
    props.setErrorHighlights(['email']);
    props.setValidCode("#f00");
  } else if (props.code.length === 6 && props.email.includes('@')) {
    validateCode({ code: props.code, email: props.email, setValidCode: props.setValidCode, setErrorMessage: props.setErrorMessage, setErrorHighlights: props.setErrorHighlights });
  } else {
    props.setErrorMessage({ type: '', message: '' });
    props.setErrorHighlights([]);
    props.setValidCode("#8205ff")
  }
}


interface ValidatePasswordsProps {
  password: string,
  confirmPassword: string,
  setErrorMessage: Dispatch<SetStateAction<{ type: string, message: string }>>,
  setErrorHighlights: Dispatch<SetStateAction<string[]>>
}
export const validatePasswords = (props: ValidatePasswordsProps) => {
  if (props.password !== props.confirmPassword && props.confirmPassword !== '') {
    props.setErrorMessage({ type: 'signup', message: 'passwords do not match' });
    props.setErrorHighlights(['password', 'confirmPassword']);
    return false
  } else {
    props.setErrorMessage({ type: '', message: '' });
    props.setErrorHighlights([]);
    return true
  }
}