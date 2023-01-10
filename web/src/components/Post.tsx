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

  const commentItems = comments.map((i) => {
    return (
      <Comment comment={i} lastCommentID={comments[comments.length-1].commentID} />
    )
  });

  useEffect(() => {
    getComments();
  }, [])

  const getComments = () => {
    Axios.get(`${api}/post/comments/get/${post.postID}`, {
      headers: { authorisation: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => {
      console.log(res.data)
      setComments(res.data)
    })
  }

  if (post.imageUrl && post.imageUrl !== '') {
    return (
      <div>
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
        </div>
        
        <div id='footer' className='footer'>
          <div className='upvoteButtonPill' onClick={() => upvotePost()}>
            <span style={{flex: 1, paddingLeft: 20}}>{convertTrendPoints(trendPoints)}</span>
            <div className='upvoteButton'>
              <SvgAddButton height={30} fontVariant={post.voted ? 'hidden' : 'visible'} stroke={'#00FFA3'}/>
            </div>
          </div>
          <input color='#00FFA3' style={{backgroundColor: '#CCFFED', border: 0, height: 30, flex: 1, marginLeft: 15, borderRadius: 15, paddingLeft: 15}}  placeholder='comment something'/>
        </div>
      </div>
    )
  }
 
}

// needs upvote button + image posts + post editor + comments)