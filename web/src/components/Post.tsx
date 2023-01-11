import React, { useEffect, useState } from 'react'
import { CommentType, PostItem } from '../../types'
import './Post.css'
import Axios from 'axios';
import { useAppSelector } from '../redux/Actions';
import SvgAddButton from '../assets/svg/SvgAddButton';
import { Comment } from './Comment';
import { getMessageAge } from '../redux/helpers';


const api = 'http://localhost:9000'

export const Post: React.FC<PostItem> = ({ post, poster }) => {

  const selector = useAppSelector(state => state)
  const [trendPoints, setTrendPoints] = useState(post.trendPoints)
  const [comments, setComments] = useState<CommentType[]>([])
  const [comment, setComment] = useState('')
  const [editingComment, setEditingComment] = useState(-1)
  const [editing, setEditing] = useState(-1)
  const [showAll, setShowAll] = useState(false)
  
  useEffect(() => {
    getComments();
  }, [])

  const upvotePost = () => {
    const params = {
      userID: selector.user.userID,
      posterID: poster.userID
    }
    Axios.post(`${api}/post/upvote/${post.postID}`, params, {
      headers: { authorisation: `Bearer ${localStorage.getItem('token')}` } 
    }).then(res => {
      setTrendPoints(post.voted ? trendPoints - 1 : trendPoints + 1)
      post.voted = !post.voted
    })
  }

  const convertTrendPoints = (points: number): string => {
    let pointString = points.toString()
    if (points > 1000) {
      pointString = `${Math.round(points/1000 * 10) / 10}k`
    }
    return pointString
  }

  const postComment = () => {
    if (editingComment !== -1) {
      updateComment();
      return;
    }
    Axios.post(`${api}/post/comments/post`, {
      postID: post.postID,
      userID: selector.user.userID,
      body: comment
    }).then(res => {
      setComment('')
      getComments()
    })
  }

  const updateComment = () => {
    Axios.post(`${api}/post/comments/update`, {
      postID: post.postID,
      commentID: editingComment,
      userID: selector.user.userID,
      body: comment
    }).then(res => {
      setComment('')
      getComments()
      setEditing(-1);
    })
  }
  
  const getComments = () => {
    Axios.get(`${api}/post/comments/get/${post.postID}`, {
      headers: { authorisation: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => {
      console.log(res.data)
      setComments(res.data)
    })
  }

  const editComment = (id: number) => {
    if (id === -1) {
      setComment('')
    }
    setEditingComment(id)
    const commentToEdit = comments.filter(c => c.commentID === id)[0]
    setComment(commentToEdit.body)
  }

  const commentItems = comments.map((i) => {
    if (comments.findIndex(c => c.commentID === i.commentID) <= 1 || showAll) {
      return (
        <Comment comment={i} lastCommentID={comments[comments.length - 1].commentID} getComments={getComments} editComment={editComment} setEditing={setEditing} editing={editing} />
      )
    } else return (null)
  });

  if (post.postImageUrl && post.postImageUrl !== '') {
    return (
      <div>
        <img src={'http://localhost:9000' + post.postImageUrl} alt='profile' className='postProfileImage'/>
        has image
      </div>
    )
  }
  else {
    return (
      <div className='post'>
        <div id='header' className='header'>
          <img src={'http://localhost:9000' + poster.profileImageUrl} alt='profile' className='postProfileImage'/>
          <div style={{ flexDirection: 'column', display: 'flex', alignItems: 'start', flex: 1 }}>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
              <span className='headerTextName'>{poster.name}</span> <span className='headerTextCompany'>{getMessageAge(new Date(post.createdAt * 1000))}</span>
            </div>
            <div className='headerTextCompany' style={{ justifyContent: 'space-between', display: 'flex', flexDirection: 'row', width: '100%' }}>
              <span className='headerTextCompany'>{poster.company}</span> <span>#tag</span>
            </div>
            
          </div>
        </div>
        <div id='body' className='body'>
          <span className='bodyText'>{post.body}</span>
        </div>
        <div style={{paddingTop: '1rem', paddingBottom: '1rem'}}>
          {commentItems}
          {comments.length > 2 ? (
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <span style={{fontSize: 12}}>{showAll ? '' : `${comments.length - 2} comment${comments.length - 2 === 1 ? '' : 's'} hidden`}</span>
              <span style={{ fontSize: 12, cursor: 'pointer', userSelect: 'none' }} onClick={() => setShowAll(!showAll)}>{showAll ? 'hide' : 'show'}</span>
            </div>
          ) : (null)}
          
        </div>
        
        <div id='footer' className='footer'>
          <div className='upvoteButtonPill' onClick={() => upvotePost()}>
            <span style={{flex: 1, paddingLeft: 20}}>{convertTrendPoints(trendPoints)}</span>
            <div className='upvoteButton'>
              <SvgAddButton height={30} fontVariant={post.voted ? 'hidden' : 'visible'} stroke={'#00FFA3'}/>
            </div>
          </div>
          <input type={'text'} color='#00FFA3' className='commentInput' value={comment} onChange={(e) => setComment(e.target.value)} placeholder='comment something' />
          <button className='submitButton' hidden={comment === ''} onClick={() => postComment()}>{editingComment === -1 ? 'comment' : 'update' }</button>
        </div>
      </div>
    )
  }
 
}

// needs upvote button + image posts + post editor + comments)