import React, { useState } from 'react'
import { RecentPosterType } from '../../types'
import { DEFAULT_PROFILE_IMAGE, S3_BUCKET } from '../constants'
import './RecentPoster.css'

export interface Props {
  user: RecentPosterType
}

export const RecentPoster: React.FC<Props> = ({ user }) => {
  
  const [imageUrl, setImageUrl] = useState(user.profileImageUrl)
  const [errored, setErrored] = useState(false)

  const onError = () => {
    if (!errored) {
      setErrored(true)
      setImageUrl(DEFAULT_PROFILE_IMAGE)
    }
  }

  return (
    <div className='recentPoster'>
      <img src={S3_BUCKET + imageUrl} onError={onError} alt='profile' className='profileImage' />
      <div style={{ flexDirection: 'column', display: 'flex', textAlign: 'start', flex: 1, width: 0, textOverflow: 'ellipsis', overflow: 'hidden' }}>
        <span className='text'>{user.name}</span>
        <div className='subHeader subtext'>
          <span>{user.company}</span> <span>{user.postCount} {user.postCount === 1 ? 'post' : 'posts'}</span> 
        </div>
        
      </div>      
    </div>
  )
}
