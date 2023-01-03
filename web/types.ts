export interface User {
  userID: number,
  name: string,
  email: string,
  company: string,
  trendPoints: number,
  profileImageUrl: string
}

export interface Interest {
  interestID: number,
  name: string,
  userID: number
}