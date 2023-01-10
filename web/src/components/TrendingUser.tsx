import React from 'react'
import { TrendingUserType } from '../../types'
import './TrendingUser.css'

interface Props {
  user: TrendingUserType
}

export const TrendingUser: React.FC<Props> = ({user}) => {
  return (
    <div className='main'>
      <img src={'http://localhost:9000' + user.profileImageUrl} alt='profile' className='rpProfileImage' />
      <div style={{ flexDirection: 'column', display: 'flex', textAlign: 'start', flex: 1 }}>
        <span className='text' style={{color: (user.difference > 0 ? '#00B224' : user.difference < 0 ? '#B22234' : '#5900B2')}}>{user.name}</span>
        <div className='subHeader subtext'>
          <span>trend points: {user.trendPoints}</span> 
        </div>
        
      </div> 
      <span style={{fontSize: 20, marginLeft: '1.5rem', color: (user.difference > 0 ? '#00B224' : user.difference < 0 ? '#B22234' : '#5900B2') }}>{user.difference > 0 ? '+' : user.difference < 0 ? '-' : ''}{Math.abs(user.difference)}</span> 

    </div>
  )
}
