
const API_URLS = {
  env: process.env.REACT_APP_API_KEY,
  dev: 'https://dev.api.fromeroad.com',
  prod: 'https://api.fromeroad.com',
  local: 'http://localhost'
}

const S3_URLS = {
  env: process.env.REACT_APP_S3_URL,
  prod: 'https://fromeroad-prod.s3.ap-southeast-2.amazonaws.com',
  dev: 'https://fromeroad-dev.s3.ap-southeast-2.amazonaws.com'
}


// reset to env each commit
const API = API_URLS.env; 
const S3_BUCKET = S3_URLS.env


const HOUR = 60000 * 60;
const EIGHT_MEGABYTES = 1048576 * 8; // 1mb * 8 in bytes
const DEFAULT_PROFILE_IMAGE = S3_BUCKET+'/default/default_profile_image.jpg';
const JWT_TOKEN = `Bearer ${localStorage.getItem('token')}`

export {API}
export {EIGHT_MEGABYTES}
export {HOUR}
export {DEFAULT_PROFILE_IMAGE}
export {JWT_TOKEN}
export {S3_BUCKET}