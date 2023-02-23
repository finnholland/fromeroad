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

const HOUR = 60000 * 60
interface Props {
  logout: any
}

const Home: React.FC<Props> = (props: Props) => {
  const selector = useAppSelector(state => state);
  const dispatch = useAppDispatch();
  const [profileImageUrl, setProfileImageUrl] = useState(selector.user.profileImageUrl);

  const [removeSvgHover, setRemoveSvgHover] = useState(-1);
  const [addSvgHover, setAddSvgHover] = useState(-2);
  const [plusHover, setPlusHover] = useState(false);
  const [refreshHover, setRefreshHover] = useState(false);
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
      <Post key={i.post.postID} post={i.post} poster={i.poster} />
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const uploadImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files[0].size >= EIGHT_MEGABYTES) {
        alert('too large! 8mb or less plz')
        return;
      } else {
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
    }
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

  return (
    <div className="app">
      <Header type='desktop' showGithub={true} />
      <div className='home'>
        <div id='body' style={{ flexDirection: 'row', display: 'flex', flex: 6, paddingBottom: 100}}>
          
          <div id='recentPosters' style={{ flex: 1 }}>
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

          <div id='profile' style={{ flex: 1 }}>
            <div className='titleDiv'>
              <p className='sectionTitle'>me</p>
              <hr className='line' />
              <LogoutIcon onClick={() => props.logout()} height={25} width={25} style={{ marginLeft: 15 }} fill={'#8205ff'} />
            </div>
              <div>
                <div style={{ flexDirection: 'row', display: 'flex' }}>
                  <div>
                    <div className='profileImage' id='profileImage' onClick={(e) => handleClick(e)} style={{ backgroundImage: `url(${API}${profileImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center center' }}>
                      <div className='profileImageOverlay'>
                        <span style={{alignItems: 'center', display:'flex', marginBottom: 5, color: '#fff'}}>change</span>
                      </div>
                    </div>
                  </div>
                  <div className='detailsDiv'>
                    <p className='name'>{selector.user.name}</p>
                    <p className='company'>{selector.user.company}</p>
                  </div>

                </div>
                <hr className='subline' />
                <div style={{ display: 'flex', flex: 1, padding: 10, flexDirection: 'column' }}>
                  {interestItems}
                </div>
                <div className='addInterestDiv'>
                  <input type={'text'} placeholder='add interests' className='interestInput' value={interest} onChange={(e) => changeInterestSearch(e.target.value)}/>
                  <SvgAddButton fill={addSvgHover === -1 ? '#ffb405' : '#DECCF0'} stroke={addSvgHover === -1 ? '#ffb405' : '#c182ff'} height={40} onMouseEnter={() => setAddSvgHover(-1)}
                    onMouseLeave={() => setAddSvgHover(-2)} onClick={() => interest.trim() !== '' ? addInterest(interest.trim()) : null} />

                </div>
                <div style={{ display: 'flex', flex: 1, padding: 10, flexDirection: 'column', textAlign: 'left' }}>
                  {
                    interestSearchResults.length !== 0 ?
                      <div style={{justifyContent: 'space-between', display: 'flex'}}>
                        <span style={{ fontSize: 12 }}>suggestions:</span>
                        <span style={{ fontSize: 12, color: 'red', cursor: 'pointer' }} onClick={() => changeInterestSearch('')}>clear</span>
                      </div>
                    
                    : null
                  }
                  {interestSearchResults}
                </div>
              <hr className='subline'/>
            </div>
          </div>

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
      <input ref={ref} type={'file'} accept="image/png, image/jpeg" name="file" onChange={uploadImage} hidden/>
    </div>
  );
}

export default Home;
