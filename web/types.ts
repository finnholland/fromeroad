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

export interface Post {
  postID: number,
  body: string,
  imageUrl: string | undefined,
  trendPoints: number,
  voted: boolean,
}

export interface Poster {
  userID: number,
  name: string,
  profileImageUrl: string,
  company: string
}

export interface PostItem {
  post: Post,
  poster: Poster
}

export interface RecentPosterType {
  userID: number,
  name: string,
  company: string,
  postCount: number,
  profileImageUrl: string,
}

export interface RecentPosterProps {
  user: RecentPosterType
}