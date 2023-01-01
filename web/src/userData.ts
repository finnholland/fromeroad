import { User } from '../types'
let userData: User = {
  userID: 0,
  name: '',
  email: '',
  company: '',
  trendPoints: 0,
  profileImageUrl: ''
}

function setUser(user: User) {
  userData = user
}

function getUser() {
  return userData;
}

export { setUser }
export { getUser }