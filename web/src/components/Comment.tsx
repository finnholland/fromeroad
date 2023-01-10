import moment from 'moment'
import React from 'react'
import { CommentType } from '../../types'
import { getMessageAge } from '../redux/helpers'
import './Comment.css'

interface Props {
  comment: CommentType
  lastCommentID: number
}

export const Comment: React.FC<Props> = ({ comment, lastCommentID }) => {

  return (
    <div className='comment' style={{marginBottom: (lastCommentID === comment.commentID ? 0 : '1.5rem')}}>
      <div style={{display: 'flex', width: '100%'}}>
        <img src={'http://localhost:9000' + comment.profileImageUrl} alt='profile' className='commentProfileImage' />
        <div style={{ flexDirection: 'column', display: 'flex', textAlign: 'start', flex: 1 }}>
          <span className='text' style={{ color: '#B27D00'}}>{comment.name}</span>
          <div className='subHeader subtext'>
            <span>{comment.company}</span> <span>{getMessageAge(new Date(comment.createdAt * 1000))}</span>
          </div>
        </div> 
      </div>

      <span style={{fontSize: 14, color: '#B27D00', marginTop: 10 }}>{comment.body}</span> 

    </div>
  )
}
