import  Axios  from 'axios';
import React, { useEffect, useState } from 'react'
import { RecentPosterType } from '../../../types';
import { HOUR, API } from '../../constants';
import { RecentPoster } from '../RecentPoster';

export const MobileActivity = () => {
  const [activity, setActivity] = useState<RecentPosterType[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  
  const activityItems = activity.map((i) => {
    return (
      <RecentPoster key={i.userId} user={i} />
    )
  });

  useEffect(() => {
    getActivity();
    const trendInterval = setInterval(() => {
      getActivity();
    }, HOUR);
    
    return () => clearInterval(trendInterval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getActivity = () => {
    setActivityLoading(true)
    setActivity([])
    Axios.get(`${API}/recentPosters`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => {
      setActivity(res.data)
      setActivityLoading(false)
    })
  }

  return (
    <div className='subPageContainer'>
      {activityLoading ? <div className="lds-ellipsis loadingCentered"><div></div><div></div><div></div><div></div></div> : activityItems}
    </div>
  )
}
