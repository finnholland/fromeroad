
const API_URLS = {
  env: process.env.REACT_APP_API_KEY,
  dev: 'https://dev.api.fromeroad.com',
  prod: 'https://api.fromeroad.com',
  local: 'http://localhost:8080'
}

const S3_URLS = {
  env: process.env.REACT_APP_S3_URL,
  prod: 'https://fromeroad-prod.s3.ap-southeast-2.amazonaws.com',
  dev: 'https://fromeroad-dev.s3.ap-southeast-2.amazonaws.com',
  local: API_URLS.local
}


// reset to env each commit
const API = API_URLS.env;
const S3_BUCKET = S3_URLS.env


const HOUR = 60000 * 60;
const EIGHT_MEGABYTES = 1048576 * 8; // 1mb * 8 in bytes
const DEFAULT_PROFILE_IMAGE = '/data/default/default_profile_image.jpg';
const JWT_TOKEN = `Bearer ${localStorage.getItem('token')}`
const CRYPTO_KEY = process.env.REACT_APP_CRYPTO_KEY || 'c973dcf40aa4860d' // local dev 

const PLACEHOLDERS = ['hello moon - 🌏', 'hello moon - 🌏', 'pasted links will be shortened :)', 'you can tag; words with ;']
const EMAILS = ['@chamonix.com.au', '@expose.com.au']

export {API, PLACEHOLDERS, EIGHT_MEGABYTES, HOUR, DEFAULT_PROFILE_IMAGE, JWT_TOKEN, CRYPTO_KEY, S3_BUCKET, EMAILS}