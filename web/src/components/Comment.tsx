import Axios from 'axios'
import React, { useState } from 'react'
import { CommentType } from '../../types'
import { useAppSelector } from '../redux/Actions'
import { getMessageAge } from '../redux/helpers'
import './Comment.css'

interface Props {
  comment: CommentType
  lastCommentID: number,
  getComments: any
  editComment: any
}
const api = 'http://localhost:9000'

export const Comment: React.FC<Props> = (props: Props) => {

  const selector = useAppSelector(state => state)
  const [editing, setEditing] = useState(false)

  const deleteComment = () => {
    Axios.delete(`${api}/post/comments/delete/${props.comment.commentID}`, {
      headers: { authorisation: `Bearer ${localStorage.getItem('token')}` } 
    }).then(res => {
      console.log(res)
      props.getComments()
    })
  }

  const editHandler = () => {
    const edit = !editing
    props.editComment(edit ? props.comment.commentID : -1)
    setEditing(edit)
    
  }

  if (selector.user.userID === props.comment.userID) {
    return (
      <div className='comment' style={{marginBottom: (props.lastCommentID === props.comment.commentID ? 0 : '1.5rem')}}>
        <div style={{display: 'flex', width: '100%'}}>
          <img src={'http://localhost:9000' + props.comment.profileImageUrl} alt='profile' className='commentProfileImage' />
          <div style={{ flexDirection: 'column', display: 'flex', textAlign: 'start', flex: 1 }}>
            <div style={{flexDirection: 'row', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span className='text' style={{ color: '#B27D00' }}>{props.comment.name}</span>
              <div style={{justifyContent: 'end', display: 'flex', fontSize: 11}}>
                <span style={{ marginRight: 15, cursor: 'pointer' }} onClick={() => editHandler()}>{editing ? 'cancel' : 'edit'}</span>
                <span style={{cursor: 'pointer'}} onClick={() => deleteComment()}>delete</span>
              </div>
            </div>
            <div className='subHeader subtext'>
              <span>{props.comment.company}</span> <span>{getMessageAge(new Date(props.comment.createdAt * 1000))}</span>
            </div>
          </div> 
        </div>
        <span contentEditable={editing} style={{fontSize: 14, color: '#B27D00', marginTop: 10 }}>{props.comment.body}</span>
      </div>
    )
  } else {
    return (
      <div className='comment' style={{marginBottom: (props.lastCommentID === props.comment.commentID ? 0 : '1.5rem')}}>
        <div style={{display: 'flex', width: '100%'}}>
          <img src={'http://localhost:9000' + props.comment.profileImageUrl} alt='profile' className='commentProfileImage' />
          <div style={{ flexDirection: 'column', display: 'flex', textAlign: 'start', flex: 1 }}>
            <span className='text' style={{ color: '#B27D00' }}>{props.comment.name}</span>
            <div className='subHeader subtext'>
              <span>{props.comment.company}</span> <span>{getMessageAge(new Date(props.comment.createdAt * 1000))}</span>
            </div>
          </div> 
        </div>
        <span style={{fontSize: 14, color: '#B27D00', marginTop: 10 }}>{props.comment.body}</span> 
      </div>
    )
  }
}
