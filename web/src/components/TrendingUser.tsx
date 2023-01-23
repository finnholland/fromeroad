import React, { useState } from 'react'
import { TrendingUserType } from '../../types'
import { DEFAULT_PROFILE_IMAGE, API } from '../constants'
import './TrendingUser.css'

interface Props {
  user: TrendingUserType
}

export const TrendingUser: React.FC<Props> = ({ user }) => {
  
  const [imageUrl, setImageUrl] = useState(user.profileImageUrl)
  const [errored, setErrored] = useState(false)

  const onError = () => {
    if (!errored) {
      setErrored(true)
      setImageUrl(DEFAULT_PROFILE_IMAGE)
    }
  }
  
  return (
    <div className='trendingUser'>
      <img src={API + imageUrl} onError={onError} alt='profile' className='profileImage' />
      <div style={{ flexDirection: 'column', display: 'flex', textAlign: 'start', flex: 1 }}>
        <span className='text' style={{color: (user.difference > 0 ? '#05ff37' : user.difference < 0 ? '#ff1f3a' : '#8205ff')}}>{user.name}</span>
        <div className='subHeader subtext'>
          <span>trend points: {user.trendPoints}</span> 
        </div>
        
      </div> 
      <span style={{fontSize: 20, marginLeft: '1.5rem', color: (user.difference > 0 ? '#05ff37' : user.difference < 0 ? '#ff1f3a' : '#8205ff') }}>{user.difference > 0 ? '+' : user.difference < 0 ? '-' : ''}{Math.abs(user.difference)}</span> 

    </div>
  )
}
