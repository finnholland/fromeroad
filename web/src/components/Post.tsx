import React, { useEffect, useState } from 'react'
import { CommentType, Poster, PostItem, PostType } from '../../types'
import './Post.css'
import Axios from 'axios';
import { useAppSelector } from '../redux/Actions';
import SvgAddButton from '../assets/svg/SvgAddButton';
import { Comment } from './Comment';
import { getMessageAge } from '../redux/helpers';
import { API, DEFAULT_PROFILE_IMAGE } from '../constants';

interface Props {
  post: PostType,
  poster: Poster
}

export const Post: React.FC<Props> = (props: Props) => {

  const selector = useAppSelector(state => state)
  const [trendPoints, setTrendPoints] = useState(props.post.trendPoints)
  const [comments, setComments] = useState<CommentType[]>([])
  const [comment, setComment] = useState('')
  const [editingComment, setEditingComment] = useState(-1)
  const [editing, setEditing] = useState(-1)
  const [showAll, setShowAll] = useState(false)
  const [imageUrl, setImageUrl] = useState(props.poster.profileImageUrl)
  const [errored, setErrored] = useState(false)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getComments();
  }, [])

  const upvotePost = () => {
    const params = {
      userID: selector.user.userID,
      posterID: props.poster.userID
    }
    Axios.post(`${API}/post/upvote/${props.post.postID}`, params, {
      headers: { authorisation: `Bearer ${localStorage.getItem('token')}` } 
    }).then(res => {
      setTrendPoints(props.post.voted ? trendPoints - 1 : trendPoints + 1)
      props.post.voted = !props.post.voted
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
    Axios.post(`${API}/post/comments/post`, {
      postID: props.post.postID,
      userID: selector.user.userID,
      body: comment
    }).then(res => {
      setComment('')
      getComments()
      setShowAll(true)
    })
  }

  const updateComment = () => {
    Axios.post(`${API}/post/comments/update`, {
      postID: props.post.postID,
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
    setLoading(true)
    Axios.get(`${API}/post/comments/get/${props.post.postID}`, {
      headers: { authorisation: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => {
      console.log(res.data)
      setComments(res.data)
      setLoading(false)
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
        <Comment key={i.commentID} comment={i} lastCommentID={comments[comments.length - 1].commentID} getComments={getComments} editComment={editComment} setEditing={setEditing} editing={editing} />
      )
    } else return (null)
  });



  const onError = () => {
    if (!errored) {
      setErrored(true)
      setImageUrl(DEFAULT_PROFILE_IMAGE)
    }
  }

  if (props.post.postImageUrl && props.post.postImageUrl !== '') {
    return (
      <div className='post'>
        <div id='header' className='postHeader'>
          <img src={API + imageUrl} onError={onError} alt='profile' className='profileImage'/>
          <div style={{ flexDirection: 'column', display: 'flex', alignItems: 'start', flex: 1 }}>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
              <span className='headerTextName'>{props.poster.name}</span> <span className='headerTextCompany'>{getMessageAge(new Date(props.post.createdAt * 1000))}</span>
            </div>
            <div className='headerTextCompany' style={{ justifyContent: 'space-between', display: 'flex', flexDirection: 'row', width: '100%' }}>
              <span className='headerTextCompany'>{props.poster.company}</span> <span>#tag</span>
            </div>
          </div>
        </div>
        <div id='body' className='body'>
          <span className='bodyText'>{props.post.body}</span>
          <img src={API + props.post.postImageUrl} alt='postImage' className='postImage'/>
        </div>
        <hr hidden={comments.length <= 0} className='commentLine' />
        <div hidden={comments.length <= 0} style={{ padding: '2rem' }}>
          {loading ? <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div> : null}
          {comments.length > 2 ? (
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <span style={{fontSize: 12}}>{showAll ? '' : `${comments.length - 2} comment${comments.length - 2 === 1 ? '' : 's'} hidden`}</span>
              <span style={{ fontSize: 12, cursor: 'pointer', userSelect: 'none' }} onClick={() => setShowAll(!showAll)}>{showAll ? 'hide' : 'show'}</span>
            </div>
          ) : (null)}
          {commentItems}
          
        </div>
        <hr hidden={comments.length <= 0} className='commentLine' />
        <div id='footer' className='postFooter'>
          <div className='upvoteButtonPill' onClick={() => upvotePost()}>
            <span style={{flex: 1, paddingLeft: 20}}>{convertTrendPoints(trendPoints)}</span>
            <div className='upvoteButton'>
              <SvgAddButton height={30} fontVariant={props.post.voted ? 'hidden' : 'visible'} stroke={'#00FFA3'}/>
            </div>
          </div>
          <input type={'text'} color='#00FFA3' className='commentInput' value={comment} onChange={(e) => setComment(e.target.value)} placeholder='comment something' />
          <button className='submitButton' style={{backgroundColor: (comment === '' ? '#CCFFED' : '#00FFA3')}} disabled={comment === ''} onClick={() => postComment()}>{editingComment === -1 ? 'comment' : 'update' }</button>
        </div>
        
      </div>
    )
  }
  else {
    return (
      <div className='post'>
        <div id='header' className='postHeader'>
          <img src={API + imageUrl} onError={onError} alt='profile' className='profileImage'/>
          <div style={{ flexDirection: 'column', display: 'flex', alignItems: 'start', flex: 1 }}>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
              <span className='headerTextName'>{props.poster.name}</span> <span className='headerTextCompany'>{getMessageAge(new Date(props.post.createdAt * 1000))}</span>
            </div>
            <div className='headerTextCompany' style={{ justifyContent: 'space-between', display: 'flex', flexDirection: 'row', width: '100%' }}>
              <span className='headerTextCompany'>{props.poster.company}</span> <span>#tag</span>
            </div>
            
          </div>
        </div>
        <div id='body' className='body'>
          <span className='bodyText'>{props.post.body}</span>
        </div>
        <div hidden={comments.length <= 0} className='commentSection'>
          {loading ? <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div> : null}
          {commentItems}
          {comments.length > 2 ? (
            <div style={{display: 'flex', justifyContent: 'center', marginTop: 15}}>
              <span style={{fontSize: 12}}>{showAll ? 'Showing all comments' : `${comments.length - 2} comment${comments.length - 2 === 1 ? '' : 's'} hidden`}</span>
              <span style={{ fontSize: 13, cursor: 'pointer', userSelect: 'none', marginLeft: 20, color: '#5900B2' }} onClick={() => setShowAll(!showAll)}>{showAll ? 'hide' : 'show'}</span>
            </div>
          ) : (null)}
        </div>
        <div id='footer' className='postFooter' style={{ marginTop: (comments.length <= 0 ? '1rem' : 0) }}>
          <div className='upvoteButtonPill' onClick={() => upvotePost()}>
            <span style={{flex: 1, paddingLeft: 20}}>{convertTrendPoints(trendPoints)}</span>
            <div className='upvoteButton'>
              <SvgAddButton height={30} fontVariant={props.post.voted ? 'hidden' : 'visible'} stroke={'#00FFA3'}/>
            </div>
          </div>
          <input type={'text'} color='#00FFA3' className='commentInput' value={comment} onChange={(e) => setComment(e.target.value)} placeholder='comment something' />
          <button className='submitButton' style={{backgroundColor: (comment === '' ? '#CCFFED' : '#00FFA3')}} disabled={comment === ''} onClick={() => postComment()}>{editingComment === -1 ? 'comment' : 'update' }</button>
        </div>
      </div>
    )
  }
 
}

// needs upvote button + image posts + post editor + comments)