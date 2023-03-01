export interface User {
  userID: number,
  name: string,
  email: string,
  company: string,
  trendPoints: number,
  profileImageUrl: string,
  interests: Interest[],
  verified: boolean
}

export interface Interest {
  interestID: number,
  name: string,
  userID: number
}

export interface PostType {
  postID: number,
  body: string,
  postImageUrl: string | undefined,
  trendPoints: number,
  createdAt: number,
  voted: boolean,
}

export interface Poster {
  userID: number,
  name: string,
  profileImageUrl: string,
  company: string
}

export interface PostItem {
  post: PostType,
  poster: Poster
}

export interface RecentPosterType {
  userID: number,
  name: string,
  company: string,
  postCount: number,
  profileImageUrl: string,
}


export interface TrendingUserType {
  userID: number,
  name: string,
  trendPoints: number,
  position: number,
  difference: number,
  company: string,
  profileImageUrl: string
}

export interface CommentType {
  commentID: number,
  postID: number,
  userID: number,
  body: string,
  createdAt: number,
  name: string,
  company: string
  profileImageUrl: string
}

export interface Profile {
  company: string
  email: string
  name: string
  profileImageUrl: string
  trendPoints: number
  interests: Interest[]
}