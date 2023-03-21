import React, { useEffect, useState } from 'react'
import { CommentType, Poster, PostType } from '../../../types'
import '../Post.css'
import '../../screens/mobile/MobileStyles.css'
import Axios from 'axios';
import { useAppDispatch, useAppSelector } from '../../hooks/Actions';
import SvgAddButton from '../../assets/svg/SvgAddButton';
import { MobileComment } from './MobileComment';
import { getMessageAge } from '../../hooks/helpers';
import { API, DEFAULT_PROFILE_IMAGE, S3_BUCKET } from '../../constants';
import Highlighter from "react-highlight-words";
import CommentIcon from '../../assets/svg/post/Comments';
import Heart from '../../assets/svg/post/Heart';
import { getUserProfile } from '../../hooks/api/users';

interface Props {
  post: PostType,
  poster: Poster
  setCurrentRoute: any
}

export const MobilePost: React.FC<Props> = (props: Props) => {

  const selector = useAppSelector(state => state)
  const dispatch = useAppDispatch();
  const [trendPoints, setTrendPoints] = useState(props.post.trendPoints)
  const [comments, setComments] = useState<CommentType[]>([])
  const [comment, setComment] = useState('')
  const [editingComment, setEditingComment] = useState(-1)
  const [editing, setEditing] = useState(-1)
  const [showAll, setShowAll] = useState(false)
  const [imageUrl, setImageUrl] = useState(props.poster.profileImageUrl)
  const [errored, setErrored] = useState(false)
  const [loading, setLoading] = useState(true);
  const [searchWords, setSearchWords] = useState<string[]>([]);
  const [showComments, setShowComments] = useState(false)

  useEffect(() => {
    getComments();
    getSearchWords();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getSearchWords = () => {
    const words = props.post.body.split(/([^\s]*?;)/g).filter((word) => word.includes(';') && word.length !== 1 )
    setSearchWords(words)
  }

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = evt.target?.value;
    setComment(val);
  };

  const upvotePost = () => {
    const params = {
      userID: selector.user.userID,
      posterID: props.poster.userID
    }
    Axios.post(`${API}/post/upvote/${props.post.postID}`, params, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
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
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
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
    Axios.get(`${API}/post/comments/get/${props.post.postID}`, {
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
    const commentToEdit = comments.filter(c => c.commentID === id)[0]
    setComment(commentToEdit.body)
  }

  const commentItems = comments.map((i) => {
    if (comments.findIndex(c => c.commentID === i.commentID) <= 1 || showAll) {
      return (
        <MobileComment key={i.commentID} comment={i} lastCommentID={comments[comments.length - 1].commentID} getComments={getComments} editComment={editComment} setEditing={setEditing} editing={editing} />
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
          <img src={S3_BUCKET + imageUrl} onError={onError} alt='profile' className='profileImage'/>
          <div style={{ flexDirection: 'column', display: 'flex', alignItems: 'start', flex: 1 }}>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
              <span className='headerTextName'>{props.poster.name}</span> <span className='headerTextCompany'>{getMessageAge(new Date(props.post.createdAt * 1000))}</span>
            </div>
            <div className='headerTextCompany' style={{ justifyContent: 'space-between', display: 'flex', flexDirection: 'row', width: '100%' }}>
              <span className='headerTextCompany'>{props.poster.company}</span>
            </div>
          </div>
        </div>
        <div id='body' className='postBody'>
          <Highlighter
            textToHighlight={props.post.body}
            searchWords={searchWords}
            highlightClassName="highlight"
            highlightStyle={undefined}
            className='bodyText'
          />
          <img src={S3_BUCKET + props.post.postImageUrl} alt='postImage' className='postImage'/>
        </div>
        <div hidden={comments.length <= 0} className='commentSection'>
          {loading ? <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div> : null}
          {commentItems}
          {comments.length > 2 ? (
            <div style={{display: 'flex', justifyContent: 'center', marginTop: 15}}>
              <span style={{fontSize: 12}}>{showAll ? 'Showing all comments' : `${comments.length - 2} comment${comments.length - 2 === 1 ? '' : 's'} hidden`}</span>
              <span style={{ fontSize: 13, cursor: 'pointer', userSelect: 'none', marginLeft: 20, color: '#8205ff' }} onClick={() => setShowAll(!showAll)}>{showAll ? 'hide' : 'show'}</span>
            </div>
          ) : (null)}
        </div>
        <div id='footer' className='postFooter' style={{ marginTop: (comments.length <= 0 ? '1rem' : 0) }}>
          <div className='upvoteButtonPill' onClick={() => upvotePost()}>
            <span style={{flex: 1, paddingLeft: 20}}>{convertTrendPoints(trendPoints)}</span>
            <div className='upvoteButton'>
              <SvgAddButton height={30} fontVariant={props.post.voted ? 'hidden' : 'visible'} stroke={'#3fffb9'}/>
            </div>
          </div>
          <input type={'text'} color='#3fffb9' className='commentInput' value={comment} onChange={(e) => setComment(e.target.value)} placeholder='comment something' />
        </div>
        <button className='postButton' style={{ flex: 1, marginTop: '1rem', cursor: 'pointer', backgroundColor: '#3fffb9', display: (comment === '' ? 'none' : 'inherit'), width: '100%', justifyContent: 'center' }} onClick={() => postComment()} >
          <span>post</span>
        </button>
      </div>
    )
  }
  else {
    return (
      <div className='post'>
        <div id='header' className='postHeader user'>
          <div className='user' onClick={() => { getUserProfile(dispatch, selector.user.userID, props.poster.userID); props.setCurrentRoute('profile') }}>
            <img src={S3_BUCKET + imageUrl} onError={onError} alt='profile' className='profileImage' />
            <div className='headerDetails'>
              <span className='headerTextName'>{props.poster.name}</span>
              <span className='headerTextCompany'>{props.poster.company}</span>
            </div>
          </div>
          <span className='headerTextCompany'>{getMessageAge(new Date(props.post.createdAt * 1000))}</span>
        </div>
        <div id='body' className='postBody'>
          <Highlighter
            textToHighlight={props.post.body}
            searchWords={searchWords}
            highlightClassName="highlight"
            highlightStyle={undefined}
            className='bodyText'
          />
        </div>
        <div id='footer' className='postFooter'>
          <div style={{width: '50%', alignItems: 'center', display: 'flex', justifyContent: 'space-between', flexDirection: 'row', userSelect: 'none', textAlign: 'start'}}>
            <div style={{alignItems: 'center', display: 'flex', cursor: 'pointer'}} onClick={() => upvotePost()}>
              <Heart stroke={'#8205FF'} fill={props.post.voted || selector.user.userID === props.poster.userID ? '#EEBEFF' : '#fff'} strokeWidth={1.1} height={30} />
              <span style={{flex: 1, paddingLeft: 10, color: '#8205FF'}}>{convertTrendPoints(trendPoints)}</span>
            </div>
            <div style={{alignItems: 'center', display: 'flex', cursor: 'pointer'}} onClick={() => setShowComments(!showComments)}>
              <CommentIcon fill={'#00FFA3'} height={30} />
              <span style={{flex: 1, paddingLeft: 10, color: '#00FFA3'}}>{comments.length}</span>
            </div>
          </div>
        </div>
        {showComments ? (
          <div className='commentEditor'>
            <textarea className='postBodyInput' maxLength={157} placeholder='hello world - 🌒' onChange={handleChange} value={comment} rows={2}/>
            <button className='submitButton' style={{ backgroundColor: (comment.trim() === '' ? '#d9fff1' : '#3fffb9') }} disabled={comment.trim() === ''} onClick={() => postComment()}>
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
}

// needs upvote button + image posts + post editor + comments)