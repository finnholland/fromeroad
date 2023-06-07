import Axios from 'axios'
import React from 'react'
import { CommentType } from '../../../types'
import { API, S3_BUCKET } from '../../constants'
import { useAppDispatch, useAppSelector } from '../../hooks/Actions'
import { getUserProfile } from '../../hooks/api/users'
import { getMessageAge } from '../../hooks/helpers'
import '../Comment.css'

interface Props {
  comment: CommentType
  lastCommentId: number,
  getComments: any
  editComment: any
  setEditing: any
  editing: any
  setCurrentRoute: any
}

export const MobileComment: React.FC<Props> = (props: Props) => {

  const selector = useAppSelector(state => state)
  const dispatch = useAppDispatch();
  
  const deleteComment = () => {
    Axios.delete(`${API}/post/comments/delete/${props.comment.commentId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
    }).then(props.getComments())
  }

  const editHandler = () => {
    let edit = 0
    if (props.editing !== -1 && props.editing !== props.comment.commentId) {
      edit = (props.comment.commentId);
    } else {
      edit = (props.editing === -1 ? props.comment.commentId : -1);
    }
    
    props.setEditing(edit);
    props.editComment(edit);
  }

  if (selector.user.userId === props.comment.userId) {
    return (
      <div className='comment' style={{marginBottom: (props.lastCommentId === props.comment.commentId ? 0 : '1.5rem')}}>
        <div style={{display: 'flex', width: '100%'}}>
          <img src={S3_BUCKET + props.comment.profileImageUrl} alt='profile' className='profileImage' />
          <div style={{ flexDirection: 'column', display: 'flex', textAlign: 'start', flex: 1, overflow: 'hidden' }}>
            <div style={{flexDirection: 'row', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span className='text' style={{ color: '#ffb405', width: '65%' }}>{props.comment.name}</span>
              <div style={{justifyContent: 'end', display: 'flex', fontSize: 11}}>
                <span style={{ marginRight: 15, cursor: 'pointer', userSelect: 'none', marginLeft: 10 }} onClick={() => editHandler()}>{props.editing === props.comment.commentId ? 'cancel' : 'edit'}</span>
                <span style={{cursor: 'pointer', userSelect: 'none'}} onClick={() => deleteComment()}>delete</span>
              </div>
            </div>
            <div className='subHeader subtext'>
              <span>{props.comment.company}</span> <span>{getMessageAge(new Date(props.comment.createdAt * 1000))}</span>
            </div>
          </div> 
        </div>
        <span style={{fontSize: 14, color: '#ffb405', marginTop: 10, textAlign: 'start' }}>{props.comment.body}</span>
      </div>
    )
  } else {
    return (
      <div className='comment' style={{marginBottom: (props.lastCommentId === props.comment.commentId ? 0 : '1.5rem')}}>
        <div className='commentHeader' onClick={() => { getUserProfile(dispatch, selector.user.userId, props.comment.userId); props.setCurrentRoute('profile') }}>
          <img src={S3_BUCKET + props.comment.profileImageUrl} alt='profile' className='profileImage' />
          <div style={{ flexDirection: 'column', display: 'flex', textAlign: 'start', flex: 1, overflow: 'hidden' }}>
            <span className='text' style={{ color: '#ffb405', width: '65%' }}>{props.comment.name}</span>
            <div className='subHeader subtext'>
              <span>{props.comment.company}</span> <span>{getMessageAge(new Date(props.comment.createdAt * 1000))}</span>
            </div>
          </div> 
        </div>
        <span style={{fontSize: 14, color: '#ffb405', marginTop: 10, textAlign: 'start' }}>{props.comment.body}</span> 
      </div>
    )
  }
}
