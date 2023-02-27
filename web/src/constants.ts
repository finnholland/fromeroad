
const API_URLS = {
  env: process.env.REACT_APP_ENV_API_KEY,
  dev: 'https://dev.api.fromeroad.com',
  prod: 'https://dev.api.fromeroad.com',
  local: 'http://localhost'
}
const API = API_URLS.local;

const HOUR = 60000 * 60;
const EIGHT_MEGABYTES = 1048576 * 8; // 1mb * 8 in bytes
const DEFAULT_PROFILE_IMAGE = '/data/default/default_profile_image.jpg';
const JWT_TOKEN = `Bearer ${localStorage.getItem('token')}`

export {API}
export {EIGHT_MEGABYTES}
export {HOUR}
export {DEFAULT_PROFILE_IMAGE}
export {JWT_TOKEN}