export interface User {
  userId: number,
  name: string,
  email: string,
  company: string,
  project: string,
  phone: string,
  trendPoints: number,
  profileImageUrl: string,
  interests: Interest[],
  verified: boolean
}

export interface Interest {
  interestId: number,
  name: string,
  userId: number
}

export interface PostType {
  postId: number,
  body: string,
  postImageUrl: string | undefined,
  trendPoints: number,
  createdAt: number,
  voted: boolean,
}

export interface Poster {
  userId: number,
  name: string,
  profileImageUrl: string,
  company: string
}

export interface PostItem {
  post: PostType,
  poster: Poster
}

export interface RecentPosterType {
  userId: number,
  name: string,
  company: string,
  postCount: number,
  profileImageUrl: string,
}


export interface TrendingUserType {
  userId: number,
  name: string,
  trendPoints: number,
  position: number,
  difference: number,
  company: string,
  profileImageUrl: string
  postCount: number
}

export interface CommentType {
  commentId: number,
  postId: number,
  userId: number,
  body: string,
  createdAt: number,
  name: string,
  company: string
  profileImageUrl: string
}

export interface ProfileType {
  company: string
  email: string
  name: string
  phone: string
  project: string
  profileImageUrl: string
  trendPoints: number
  interests: Interest[]
}