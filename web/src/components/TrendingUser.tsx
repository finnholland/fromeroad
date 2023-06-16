import React, { useEffect, useState } from 'react'
import { TrendingUserType } from '../../types'
import { DEFAULT_PROFILE_IMAGE, S3_BUCKET } from '../constants'
import { convertTrendPoints } from '../hooks/helpers'
import './TrendingUser.css'
import { useAppSelector } from '../hooks/Actions'

interface Props {
  user: TrendingUserType
}

export const TrendingUser: React.FC<Props> = ({ user }) => {
  
  const selector = useAppSelector(state => state)

  const [imageUrl, setImageUrl] = useState(user.profileImageUrl)
  const [errored, setErrored] = useState(false)

  const onError = () => {
    if (!errored) {
      setErrored(true)
      setImageUrl(DEFAULT_PROFILE_IMAGE)
    }
  }

  useEffect(() => {
    console.log(S3_BUCKET + imageUrl)
  }, [])
  
  return (
    <div className={selector.settings.darkMode ? 'trendingUserDarkMode' : 'trendingUser'}>
      <img src={`${S3_BUCKET + imageUrl}`} onError={onError} alt='profile' className='profileImage' />
      <div style={{ flexDirection: 'column', display: 'flex', textAlign: 'start', flex: 1, width: 0 }}>
        <span className='text' style={{color: (user.difference > 0 ? '#05ff37' : user.difference < 0 ? '#ff1f3a' : selector.settings.darkMode ? '#fff' : '#8205ff')}}>{user.name}</span>
        <div className='subtext'>
          <span>trend points: {convertTrendPoints(user.trendPoints)}</span> 
        </div>
        
      </div> 
      <span style={{fontSize: 20, marginLeft: '1.5rem', color: (user.difference > 0 ? '#05ff37' : user.difference < 0 ? '#ff1f3a' : '#8205ff') }}>{user.difference > 0 ? '+' : user.difference < 0 ? '-' : ''}{Math.abs(user.difference)}</span> 

    </div>
  )
}
