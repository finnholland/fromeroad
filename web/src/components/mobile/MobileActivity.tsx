import  Axios  from 'axios';
import React, { useEffect, useState } from 'react'
import { RecentPosterType } from '../../../types';
import { HOUR, API } from '../../constants';
import { RecentPoster } from '../RecentPoster';

export const MobileActivity = () => {
  const [recentPosters, setRecentPosters] = useState<RecentPosterType[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  
  const recentPostersItems = recentPosters.map((i) => {
    return (
      <RecentPoster key={i.userID} user={i} />
    )
  });

  useEffect(() => {
    getActivity();
    const trendInterval = setInterval(() => {
      getActivity();
    }, HOUR);
  }, [])

  const getActivity = () => {
    setActivityLoading(true)
    setRecentPosters([])
    Axios.get(`${API}/recentPosters`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => {
      setRecentPosters(res.data)
      setActivityLoading(false)
    })
  }

  return (
    <div>MobileActivity</div>
  )
}
