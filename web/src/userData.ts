import { User } from '../types'
let userData: User = {
  userID: 0,
  firstName: '',
  lastName: '',
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