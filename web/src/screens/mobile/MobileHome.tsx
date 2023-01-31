import React, { useEffect, useRef, useState } from 'react'
import { Interest, PostItem, Poster, RecentPosterType, TrendingUserType } from '../../../types';
import './MobileStyles.css'
import SvgRemoveButton from '../../assets/svg/removeButton';
import SvgAddButton from '../../assets/svg/SvgAddButton';
import Axios from 'axios';
import { useAppDispatch, useAppSelector } from '../../redux/Actions';
import moment from 'moment';

import { RecentPoster } from '../../components/RecentPoster';
import { TrendingUser } from '../../components/TrendingUser';
import { PostEditor } from '../../components/PostEditor';
import InfiniteScroll from 'react-infinite-scroll-component';
import { API } from '../../constants';
import { setInterests } from '../../redux/slices/userSlice';
import { Header } from '../../components/Header';
import { MobilePost } from '../../components/mobile/MobilePost';

const HOUR = 60000 * 60
interface Props {
  setAuthenticated: any
}

const MobileHome: React.FC<Props> = (props: Props) => {
  const selector = useAppSelector(state => state);
  const dispatch = useAppDispatch();
  const [profileImageUrl, setProfileImageUrl] = useState(selector.user.profileImageUrl);

  const [removeSvgHover, setRemoveSvgHover] = useState(-1);
  const [addSvgHover, setAddSvgHover] = useState(-2);
  const [plusHover, setPlusHover] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [creatingPost, setCreatingPost] = useState(false);

  const [interest, setInterest] = useState('');
  const [interestList, setInterestList] = useState<Interest[]>([]);
  const [interestSearch, setInterestSearch] = useState<Interest[]>([]);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const [recentPosters, setRecentPosters] = useState<RecentPosterType[]>([]);
  const [trendingUsers, setTrendingUsers] = useState<TrendingUserType[]>([]);

  const [loading, setLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);
  const [trendingLoading, setTrendingLoading] = useState(true);

  const ref = useRef<HTMLInputElement>(null);
  const handleClick = (e: any) => {
    if (ref.current && e.target.id === 'profileImage') {
      ref.current.click();
    }
  }

  const interestItems = interestList.map((i) => {
    return (
      <div key={i.interestID} className='interestDiv' onMouseEnter={() => setRemoveSvgHover(i.interestID)}
          onMouseLeave={() => setRemoveSvgHover(-1)} onClick={() => removeInterest(i.interestID)}>
        <span className='interestTitle'>{i.name}</span>
        <SvgRemoveButton height={20} stroke={removeSvgHover === i.interestID ? '#ffb405' : '#c182ff'} />
      </div>
    )
  });

  const interestSearchResults = interestSearch.map((i) => {
    return (
      <div className='interestDiv' onMouseEnter={() => setAddSvgHover(i.interestID)}
          onMouseLeave={() => setAddSvgHover(-2)} onClick={() => addInterestHelper(i)}>
        <span className='interestTitle'>{i.name}</span>
          <SvgAddButton height={20} stroke={addSvgHover === i.interestID ? '#ffb405' : '#c182ff'} />
      </div>
    )
  });

  const recentPostersItems = recentPosters.map((i) => {
    return (
      <RecentPoster key={i.userID} user={i} />
    )
  });

  const postItem = posts.map((i) => {
    return (
      <MobilePost key={i.post.postID} post={i.post} poster={i.poster} searchWords={selector.user.interests.map(i => i.name+';')} />
    )
  });

  const trendingUserItem = trendingUsers.map((i) => {
    return (
      <TrendingUser key={i.userID} user={i} />
    )
  });

  const addInterestHelper = (interest: Interest) => {
    if (interest.interestID) {
      let removalArray: Interest[] = interestSearch
      removalArray = removalArray.filter(i => i.interestID !== interest.interestID)
      setInterestSearch(removalArray)
    }
    addInterest(interest.name)
  }

  useEffect(() => {
    getPosts();
    getRecentPosters();
    getTrendingUsers();
    getInterests(selector.user.userID);
    const trendInterval = setInterval(() => {
      getRecentPosters();
      getTrendingUsers();
    }, HOUR);

  return () => clearInterval(trendInterval);
  }, [])

  const removeInterest = (interestID: number) => {
    Axios.delete(`${API}/user/interests/removeInterests/${selector.user.userID}/${interestID}`, {
      headers:
        { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(() => {
      getInterests(selector.user.userID)
    })
  }

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

  const uploadImage = (e: any) => {
    const fd = new FormData();
    fd.append('file', e.target.files[0])
    fd.append('userID', selector.user.userID.toString())
    Axios.post(`${API}/image/profileImage/${selector.user.userID}`, fd, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(() => {
      Axios.get(`${API}/image/profileImage/${selector.user.userID}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => {
        setProfileImageUrl(res.data[0].profileImageUrl)
      })
      
    })
  }

  const addInterest = (interest: string) => {
    const params = {
      userID: selector.user.userID,
      name: interest,
    }
    Axios.post(`${API}/user/interests/addInterests`, params, {
      headers:
        { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then((res) => {
      if (res.status !== 409) {
        getInterests(selector.user.userID)
        setRemoveSvgHover(-1)
      } else {
        alert('interest already exists')
      }
    }).catch(err => {
      alert('error: ' + err.response.status + ' - interest already added')
    })
  }

  const getInterests = (userID: number) => {
    Axios.get(`${API}/user/interests/getInterests/${userID}`, {
      headers:
        { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then((res) => {
      dispatch(setInterests(res.data));
      setInterestList(res.data)
    })
  }

  const changeInterestSearch = (search: string) => {
    setInterest(search);
    if (!search || search === '') {
      setInterestSearch([])
    } else {
      Axios.get(`${API}/user/interests/searchInterests/${search}`, {
        headers:
          { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }).then((res) => {
        const tempArr: Interest[] = []
        res.data.forEach((interest: Interest) => {
          if (interestList.findIndex(i => i.interestID === interest.interestID) === -1) {
            tempArr.push(interest)
          }
        });
        setInterestSearch(tempArr)
      })
    }
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

  const logout = () => {
    props.setAuthenticated(false);
    localStorage.removeItem('token')
  }

  const handleCreatePostClick = () => {
    setCreatingPost(!creatingPost);
    window.scrollTo(0, 0);
  }

  return (
    <div className="mobile">
      <Header type={'mobile'}/>
      <div className='home'>
        <div id='body' style={{ flexDirection: 'row', display: 'flex', flex: 1}}>
          <div id='feed' className='feed'>
            <SvgAddButton
              onClick={() => handleCreatePostClick()}
              height={50} stroke={creatingPost ? '#ffb405' : '#8205ff'}
              style={{ marginLeft: 15, position: 'fixed', right: 40, bottom: 40 }}
              className={creatingPost ? 'creatingPost' : 'cancelPost'} />

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
        </div>
      </div>
      <input ref={ref} type={'file'} name="file" onChange={uploadImage} hidden/>
    </div>
  );
}

export default MobileHome;
