import React, { useState } from 'react'
import { PostItem } from '../../types'
import './Post.css'
import Axios from 'axios';
import { useAppSelector } from '../redux/Actions';


const api = 'http://localhost:9000'

export const Post: React.FC<PostItem> = ({ post, poster }) => {

  const selector = useAppSelector(state => state)
  const [trendPoints, setTrendPoints] = useState(post.trendPoints)

  const upvotePost = () => {
    const params = {
      userID: selector.user.userID
    }
    Axios.post(`${api}/post/upvote/${post.postID}`, params, {
      headers: { authorisation: `Bearer ${localStorage.getItem('token')}` } 
    }).then(res => {
      console.log(res)
      setTrendPoints(post.voted ? trendPoints - 1 : trendPoints + 1)
      post.voted = !post.voted
    })
  }

  return (
    <div className='post'>
      <div id='header' className='header'>
        <img src={'http://localhost:9000' + poster.profileImageUrl} alt='profile' className='postProfileImage'/>
        <div style={{flexDirection: 'column', display: 'flex', alignItems: 'start'}}>
          <span className='headerTextName'>{poster.name}</span>
          <span className='headerTextCompany'>{poster.company}</span>
          
        </div>
      </div>
      <div id='body' className='body'>
        <span className='bodyText'>{post.body}</span>
      </div>
      <div id='footer' className='footer'>
        <div className='upvoteButtonPill' onClick={() => upvotePost()}>
          <span style={{paddingLeft: 15, paddingRight: 15}}>{trendPoints}</span>
          <div className='upvoteButton'>
            {post.voted ? '-' : '+'}
          </div>
        </div>

      </div>
    </div>
  )
}

// needs upvote button + image posts + post editor + comments)