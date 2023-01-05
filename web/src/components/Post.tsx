import React from 'react'
import { PostItem } from '../../types'
import './Post.css'

export const Post: React.FC<PostItem> = ({  post,  poster}) => {
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
        <div style={{ backgroundColor: '#00FFA3', justifyContent: 'space-between', width: 'fit-content', display: 'flex', borderRadius: 30, alignItems: 'center'}}>
          <span style={{paddingLeft: 15, paddingRight: 15}}>100</span>
          <div className='upvoteButton'>
            +1
          </div>
        </div>

      </div>
    </div>
  )
}

// needs upvote button + image posts + post editor + comments)