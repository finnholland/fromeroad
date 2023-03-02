import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Interest, PostItem, Poster, RecentPosterType, TrendingUserType } from '../../types';
import './Home.css'
import SvgRemoveButton from '../assets/svg/removeButton';
import SvgAddButton from '../assets/svg/SvgAddButton';
import Axios from 'axios';
import { useAppDispatch, useAppSelector } from '../hooks/Actions';
import moment from 'moment';

import { Post } from '../components/Post';

import { RecentPoster } from '../components/RecentPoster';
import { TrendingUser } from '../components/TrendingUser';
import SvgPlus from '../assets/svg/SvgPlus';
import { PostEditor } from '../components/PostEditor';
import SvgRefresh from '../assets/svg/refreshIcon';
import InfiniteScroll from 'react-infinite-scroll-component';
import { API, EIGHT_MEGABYTES } from '../constants';
import LogoutIcon from '../assets/svg/logoutIcon';
import { setInterests } from '../hooks/slices/userSlice';
import { Header } from '../components/Header';
import Tick from '../assets/svg/tick';
import { Profile } from '../components/Profile/Profile';

const HOUR = 60000 * 60
interface Props {
  logout: any
}

const Home: React.FC<Props> = (props: Props) => {
  const selector = useAppSelector(state => state);
  const dispatch = useAppDispatch();

  const [plusHover, setPlusHover] = useState(false);
  const [refreshHover, setRefreshHover] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [creatingPost, setCreatingPost] = useState(false);

  const [posts, setPosts] = useState<PostItem[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const [recentPosters, setRecentPosters] = useState<RecentPosterType[]>([]);
  const [trendingUsers, setTrendingUsers] = useState<TrendingUserType[]>([]);

  const [loading, setLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);
  const [trendingLoading, setTrendingLoading] = useState(true);

  const recentPostersItems = recentPosters.map((i) => {
    return (
      <RecentPoster key={i.userID} user={i} />
    )
  });

  const postItem = posts.map((i) => {
    return (
      <Post key={i.post.postID} post={i.post} poster={i.poster} />
    )
  });

  const trendingUserItem = trendingUsers.map((i) => {
    return (
      <TrendingUser key={i.userID} user={i} />
    )
  });

  useEffect(() => {
    getPosts();
    getRecentPosters();
    getTrendingUsers();
    const trendInterval = setInterval(() => {
      getRecentPosters();
      getTrendingUsers();
    }, HOUR);
    return () => clearInterval(trendInterval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getRecentPosters = () => {
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

  const getPosts = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 500);
    setLoading(true);
    Axios.get(`${API}/post/get`, {
      params: {
        userID: selector.user.userID,
        sign: '>',
        condition: 0
      },
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
    }).then(res => {
      updatePosts(res.data, 'top')
      setLoading(false)
    })
  }

  const refreshPosts = (sign: string) => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 500);
    setLoading(true);
    const direction = sign === '>' ? 'top' : 'bottom';
    let postID = 0
    if (sign === '>' && posts.length > 0) {
      postID = posts[0].post.postID
    } else if (sign === '<' && posts.length > 0) {
      postID = posts[posts.length - 1].post.postID
    }

    Axios.get(`${API}/post/get`, {
      params: {
        userID: selector.user.userID,
        sign: sign,
        condition: postID
      },
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => {
      updatePosts(res.data, direction)
      getRecentPosters()
      setLoading(false)
      if (res.data.length <= 0) {
        setHasMore(false)
      }
    })
  }

  const updatePosts = (data: any, direction: string) => {
    const tempPosts: PostItem[] = []
    data.forEach((p: any) => {
      if (posts.findIndex(fp => fp.post.postID === p.postID) === -1) {
        const poster: Poster = {
          userID: p.userID,
          name: p.name,
          profileImageUrl: p.profileImageUrl,
          company: p.company
        }
        const post: PostItem = {
          post: {
            postID: p.postID,
            body: p.body,
            trendPoints: p.trendPoints,
            postImageUrl: p.postImageUrl,
            createdAt: p.createdAtUnix,
            voted: !!p.vote
          },
          poster: poster
        }
        tempPosts.push(post);
      }
    });
    if (direction === 'top') {
      setPosts([...tempPosts, ...posts])
    }
    else {
      setPosts([...posts, ...tempPosts])
    }
    
  }

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
    <div className="app">
      <Header type='desktop' showGithub={true} />
      <div className='home'>
        <div id='body' style={{ flexDirection: 'row', display: 'flex', paddingBottom: 100}}>
          <div id='recentPosters' style={{ flex: 1, paddingLeft: 40 }}>
            <div className='titleDiv'>
              <p className='sectionTitle'>activity</p>
              <hr className='line'/>
            </div>
            {activityLoading ? <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div> : null}
            {recentPostersItems}
          </div>
          <div id='feed' className='feed'>
            <div className='titleDiv'>
              <p className='sectionTitle'>feed</p>
              <hr className='line' />
              <SvgPlus onMouseEnter={() => setPlusHover(true)} onMouseLeave={() => setPlusHover(false)} onClick={() => setCreatingPost(!creatingPost)}
                height={30} stroke={plusHover ? '#ffb405' : '#8205ff'} style={{ marginLeft: 15 }} className={creatingPost ? 'creatingPost' : 'cancelPost'} />
              
              <SvgRefresh onMouseEnter={() => setRefreshHover(true)} onMouseLeave={() => setRefreshHover(false)} onClick={() => refreshPosts('>')}
                height={30} strokeWidth={0.5} fill={refreshHover ? '#ffb405' : '#8205ff'} style={{ marginLeft: 15 }} className={refreshing ? 'refresh' : ''}/>
            </div>
            {creatingPost ? (
              <PostEditor setCreatingPost={setCreatingPost} refreshPosts={refreshPosts}/>

            ) : (
              null
            )}
            <InfiniteScroll
              dataLength={posts.length}
              next={() => refreshPosts('<')}
              hasMore={hasMore}
              loader={loading ? <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div> : null}
              style={{overflow: 'visible'}}>
              {postItem}
            </InfiniteScroll>
          </div>
          <Profile logout={props.logout}/>
        </div>

        <footer className='footer'>
          <div id='trendsTitle' className='titleDiv' style={{marginTop: 0}}>
            <p className='sectionTitle'>trends</p>
            <hr className='line'/>
          </div>
          <div className='footerBody'>
            {trendingLoading ? <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div> : null}
            {trendingUserItem}
          </div>         
        </footer>

      </div>
    </div>
  );
}

export default Home;
