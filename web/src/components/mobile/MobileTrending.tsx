import Axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { TrendingUserType } from '../../../types';
import { HOUR, API } from '../../constants';
import { TrendingUser } from '../TrendingUser';

export const MobileTrending = () => {
  const [trendingUsers, setTrendingUsers] = useState<TrendingUserType[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  
  const trendingUserItem = trendingUsers.map((i) => {
    return (
      <TrendingUser key={i.userID} user={i} />
    )
  });
  
  useEffect(() => {
    getTrendingUsers();
    const trendInterval = setInterval(() => {
      getTrendingUsers();
    }, HOUR);

    return () => clearInterval(trendInterval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  
  const getTrendingUsers = () => {
    setTrendingUsers([])
    setTrendingLoading(true)
    console.log('Logs every hour ' + moment().format('HH:mm:ss'));
    Axios.get(`${API}/trends/`, {
      headers:
        { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then((res) => {
      setTrendingUsers(res.data)
      setTrendingLoading(false)
    })
  }

  return (
    <div className='subPageContainer'>
      {trendingLoading ? <div className="lds-ellipsis loadingCentered"><div></div><div></div><div></div><div></div></div> : trendingUserItem}
    </div>
  )
}
