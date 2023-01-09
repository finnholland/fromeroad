import React from 'react'
import { RecentPosterProps } from '../../types'
import './RecentPoster.css'


export const RecentPoster: React.FC<RecentPosterProps> = ({user}) => {
  return (
    <div className='main'>
      <img src={'http://localhost:9000' + user.profileImageUrl} alt='profile' className='rpProfileImage' />
      <div style={{ flexDirection: 'column', display: 'flex', textAlign: 'start', flex: 1 }}>
        <span className='text'>{user.name}</span>
        <div className='subHeader subtext'>
          <span>{user.company}</span> <span>{user.postCount} {user.postCount === 1 ? 'post' : 'posts'}</span> 
        </div>
        
      </div>      
    </div>
  )
}
