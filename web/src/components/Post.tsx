import React, { useEffect, useRef, useState } from 'react'
import { CommentType, Poster, PostType } from '../../types'
import './Post.css'
import Axios from 'axios';
import { useAppDispatch, useAppSelector } from '../hooks/Actions';
import { Comment } from './Comment';
import { convertTrendPoints, getMessageAge, useAutosizeTextArea } from '../hooks/helpers';
import { API, DEFAULT_PROFILE_IMAGE, S3_BUCKET } from '../constants';
import { getUserProfile } from '../hooks/api/users';
import Heart from '../assets/svg/post/Heart';
import CommentIcon from '../assets/svg/post/Comments';

interface Props {
  post: PostType,
  poster: Poster,
  body: string
}

export const Post: React.FC<Props> = (props: Props) => {

  const selector = useAppSelector(state => state)
  const dispatch = useAppDispatch();
  const [trendPoints, setTrendPoints] = useState(props.post.trendPoints)
  const [comments, setComments] = useState<CommentType[]>([])
  const [comment, setComment] = useState('')
  const [editingComment, setEditingComment] = useState(-1)
  const [editing, setEditing] = useState(-1)
  const [showComments, setShowComments] = useState(false)
  const [imageUrl, setImageUrl] = useState(props.poster.profileImageUrl)
  const [errored, setErrored] = useState(false)
  const [loading, setLoading] = useState(true);
  const [profileHover, setProfileHover] = useState(false);

  useEffect(() => {
    getComments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useAutosizeTextArea(textAreaRef.current, comment);
  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = evt.target?.value;
    setComment(val);
  };

  const commentEnterSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
   
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      postComment()
    }
  }

  const upvotePost = () => {
    const params = {
      userId: selector.user.userId,
      posterId: props.poster.userId
    }
    Axios.post(`${API}/post/upvote/${props.post.postId}`, params, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
    }).then(res => {
      setTrendPoints(props.post.voted ? trendPoints - 1 : trendPoints + 1)
      props.post.voted = !props.post.voted
    })
  }

  const postComment = () => {
    if (editingComment !== -1) {
      updateComment();
      return;
    }
    Axios.post(`${API}/post/comments/post`, {
      postId: props.post.postId,
      userId: selector.user.userId,
      body: comment.trim()
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => {
      setComment('')
      getComments()
    })
  }

  const updateComment = () => {
    Axios.post(`${API}/post/comments/update`, {
      postId: props.post.postId,
      commentId: editingComment,
      userId: selector.user.userId,
      body: comment
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => {
      setComment('')
      getComments()
      setEditing(-1);
    })
  }
  
  const getComments = () => {
    setLoading(true)
    Axios.get(`${API}/post/comments/get/${props.post.postId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => {
      setComments(res.data)
      setLoading(false)
    })
  }

  const editComment = (id: number) => {
    if (id === -1) {
      setComment('')
    }
    setEditingComment(id)
    const commentToEdit = comments.filter(c => c.commentId === id)[0]
    setComment(commentToEdit.body)
  }

  const commentItems = comments.map((i) => {
    if (comments.findIndex(c => c.commentId === i.commentId) <= 1 || showComments) {
      return (
        <Comment key={i.commentId} comment={i} lastCommentId={comments[comments.length - 1].commentId} setComments={setComments} comments={comments} editComment={editComment} setEditing={setEditing} editing={editing} />
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
          <div className='user' onMouseOver={() => setProfileHover(true)} onMouseLeave={() => setProfileHover(false)} onClick={() => getUserProfile(dispatch, selector.user.userId, props.poster.userId )}>
            <img src={S3_BUCKET + imageUrl} onError={onError} alt='profile' className={selector.settings.darkMode ? 'profileImageDarkMode' : 'profileImage'} />
            <div className='headerDetails'>
              <span style={{textDecoration: profileHover ? 'underline' : 'none'}} className='headerTextName'>{props.poster.name}</span>
              <span className='headerTextCompany'>{props.poster.company}</span>
            </div>
          </div>
          <span className='headerTextCompany'>{getMessageAge(new Date(props.post.createdAt * 1000))}</span>
        </div>
        <div id='body' className='postBody'>
          <span dangerouslySetInnerHTML={{__html: props.body}} className={selector.settings.darkMode ? 'bodyTextDarkMode' : 'bodyText'}/>
          <img src={S3_BUCKET + props.post.postImageUrl} alt='postImage' className='postImage'/>
        </div>
        <div id='footer' className='postFooter'>
          <div style={{width: '50%', alignItems: 'center', display: 'flex', justifyContent: 'space-between', flexDirection: 'row', userSelect: 'none', textAlign: 'start'}}>
            <div style={{alignItems: 'center', display: 'flex', cursor: 'pointer'}} onClick={() => upvotePost()}>
              <Heart stroke={selector.settings.darkMode ? '#00b2b2' : '#8205FF'} fill={props.post.voted || selector.user.userId === props.poster.userId ? (selector.settings.darkMode ? '#B0FFFF' : '#EEBEFF') : '#ffffff00'} strokeWidth={1.1} height={30} />
              <span style={{flex: 1, paddingLeft: 10, color: '#8205FF'}}>{convertTrendPoints(trendPoints)}</span>
            </div>
            <div style={{alignItems: 'center', display: 'flex', cursor: 'pointer'}} onClick={() => setShowComments(!showComments)}>
              <CommentIcon fill={'#00FFA3'} height={30} />
              <span style={{flex: 1, paddingLeft: 10, color: '#00FFA3'}}>{comments.length}</span>
            </div>
          </div>
        </div>

        {showComments ? (
          <div className={selector.settings.darkMode ? 'commentEditorDarkMode' : 'commentEditor'}>
            <textarea className='postBodyInput' maxLength={157} placeholder='hello world - 🌒' onKeyDown={commentEnterSubmit} onChange={handleChange} value={comment} rows={2}
              ref={textAreaRef} />
            <button className={comment.trim() === '' ? 'submitButton submitButtonDisabled' : 'submitButton'} disabled={comment.trim() === ''} onClick={() => postComment()}>
              post
            </button>
          </div>
        ) : (null)}
        
        <div hidden={!showComments} className='commentSection'>
          {loading ? <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div> : null}
          {commentItems}
          <div style={{display: (comments.length === 0 ? 'none' : 'flex'), justifyContent: 'center', marginTop: 15}}>
            <span style={{ fontSize: 13, cursor: 'pointer', userSelect: 'none', marginLeft: 20, color: '#8205ff' }} onClick={() => setShowComments(!showComments)}>hide comments</span>
          </div>
        </div>
      </div>
    )
  }
  else {
    return (
      <div className='post'>
        <div id='header' className='postHeader'>
          <div className='user' onMouseOver={() => setProfileHover(true)} onMouseLeave={() => setProfileHover(false)} onClick={() => getUserProfile(dispatch, selector.user.userId, props.poster.userId )}>
            <img src={S3_BUCKET + imageUrl} onError={onError} alt='profile' className={selector.settings.darkMode ? 'profileImageDarkMode' : 'profileImage'} />
            <div className='headerDetails'>
              <span style={{ textDecoration: profileHover ? 'underline' : 'none' }} className='headerTextName'>{props.poster.name}</span>
              <span className='headerTextCompany'>{props.poster.company}</span>
            </div>
          </div>
          <span className='headerTextCompany'>{getMessageAge(new Date(props.post.createdAt * 1000))}</span>
        </div>
        <div id='body' className='postBody'>
          <span dangerouslySetInnerHTML={{__html: props.body}} className={selector.settings.darkMode ? 'bodyTextDarkMode' : 'bodyText'}/>
        </div>

        <div id='footer' className='postFooter'>
          <div style={{width: '50%', alignItems: 'center', display: 'flex', justifyContent: 'space-between', flexDirection: 'row', userSelect: 'none', textAlign: 'start'}}>
            <div style={{alignItems: 'center', display: 'flex', cursor: 'pointer'}} onClick={() => upvotePost()}>
              <Heart stroke={selector.settings.darkMode ? '#00b2b2' : '#8205FF'} fill={props.post.voted || selector.user.userId === props.poster.userId ? (selector.settings.darkMode ? '#B0FFFF' : '#EEBEFF') : '#ffffff00'} strokeWidth={1.1} height={30} />
              <span style={{flex: 1, paddingLeft: 10, color: '#8205FF'}}>{convertTrendPoints(trendPoints)}</span>
            </div>
            <div style={{alignItems: 'center', display: 'flex', cursor: 'pointer'}} onClick={() => setShowComments(!showComments)}>
              <CommentIcon fill={'#00FFA3'} height={30} />
              <span style={{flex: 1, paddingLeft: 10, color: '#00FFA3'}}>{comments.length}</span>
            </div>
          </div>
        </div>

        {showComments ? (
          <div className={selector.settings.darkMode ? 'commentEditorDarkMode' : 'commentEditor'}>
            <textarea className='postBodyInput' maxLength={157} placeholder='hello world - 🌒' onKeyDown={commentEnterSubmit} onChange={handleChange} value={comment} rows={2}
              ref={textAreaRef} />
            <button className={comment.trim() === '' ? 'submitButton submitButtonDisabled' : 'submitButton'} disabled={comment.trim() === ''} onClick={() => postComment()}>
              post
            </button>
          </div>
        ) : (null)}
        
        <div hidden={!showComments} className={comments.length > 0 ? 'commentSection' : ''}>
          {loading ? <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div> : null}
          {commentItems}
          <div style={{display: (comments.length === 0 ? 'none' : 'flex'), justifyContent: 'center', marginTop: 15}}>
            <span style={{ fontSize: 13, cursor: 'pointer', userSelect: 'none', marginLeft: 20, color: '#8205ff' }} onClick={() => setShowComments(!showComments)}>hide comments</span>
          </div>
        </div>
      </div>
    )
  }
}

// needs upvote button + image posts + post editor + comments)