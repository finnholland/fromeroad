import React, {  useEffect, useState } from 'react'
import { PostItem, Poster, TrendingUserType } from '../../types';
import './Home.css'
import Axios from 'axios';
import { useAppSelector } from '../hooks/Actions';
import { Post } from '../components/Post';
import { TrendingUser } from '../components/TrendingUser';
import SvgPlus from '../assets/svg/SvgPlus';
import { PostEditor } from '../components/PostEditor';
import SvgRefresh from '../assets/svg/refreshIcon';
import InfiniteScroll from 'react-infinite-scroll-component';
import { API, PLACEHOLDERS } from '../constants';
import { Header } from '../components/Header';
import { Profile } from '../components/Profile/Profile';
import * as DOMPurify from 'dompurify';
import { renderLinksAndTags } from '../hooks/posts/postHelpers';

const HOUR = 60000 * 60
interface Props {
  logout: any
}

const Home: React.FC<Props> = (props: Props) => {
  const selector = useAppSelector(state => state);

  const [plusHover, setPlusHover] = useState(false);
  const [refreshHover, setRefreshHover] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [creatingPost, setCreatingPost] = useState(false);
  const [placeholder, setPlaceholder] = useState('');

  const [posts, setPosts] = useState<PostItem[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const [trendingUsers, setTrendingUsers] = useState<TrendingUserType[]>([]);

  const [loading, setLoading] = useState(true);
  const [trendingLoading, setTrendingLoading] = useState(true);

  const postItem = posts.map((i) => {
    const body = renderLinksAndTags(i.post.body);
    let clean = DOMPurify.sanitize(body, { USE_PROFILES: { html: true }, ALLOWED_TAGS: ['span', 'a'], ADD_ATTR: ['target', 'style'] });
    return (
      <Post key={i.post.postID} post={i.post} body={clean} poster={i.poster} />
    )
  });

  const trendingUserItem = trendingUsers.map((i) => {
    return (
      <TrendingUser key={i.userID} user={i} />
    )
  });

  useEffect(() => {
    getPosts();
    getTrendingUsers();
    const trendInterval = setInterval(() => {
      getTrendingUsers();
    }, HOUR);
    return () => clearInterval(trendInterval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    Axios.get(`${API}/trends/`, {
      headers:
        { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then((res) => {
      setTrendingUsers(res.data)
      setTrendingLoading(false)
    })
  }

  const createPost = () => {
    setCreatingPost(!creatingPost);
    setPlaceholder(PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)])
  }

  return (
    <div className={selector.settings.darkMode ? "appDarkMode" : "app"}>
      <Header showGithub={true} />
      <div className='home'>
        <div id='body' style={{ flexDirection: 'row', display: 'flex', paddingTop: 20, justifyContent: 'space-between'}}>
          <div id='topten' className='topTenList'>
            <div className='titleDiv'>
              <p className={selector.settings.darkMode ? "sectionTitleDarkMode" : "sectionTitle"}>top ten</p>
              <hr className={selector.settings.darkMode ? "lineDarkMode" : "line"}/>
            </div>
            <div className='topTenScrollable'>
              {trendingLoading ? <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div> : null}
              {trendingUserItem}
            </div>
          </div>
          <div style={{width: '20vw'}}/>
          <div id='feed' className='feed'>
            <div className='titleDiv'>
              <p className={selector.settings.darkMode ? "sectionTitleDarkMode" : "sectionTitle"}>feed</p>
              <hr className={selector.settings.darkMode ? "lineDarkMode" : "line"} />
              <SvgPlus onMouseEnter={() => setPlusHover(true)} onMouseLeave={() => setPlusHover(false)} onClick={() => createPost()}
                height={30} stroke={plusHover ? '#ffb405' : (selector.settings.darkMode ? '#B17EFF': '#8205ff')} style={{ marginLeft: 15 }} className={creatingPost ? 'creatingPost' : 'cancelPost'} />
              
              <SvgRefresh onMouseEnter={() => setRefreshHover(true)} onMouseLeave={() => setRefreshHover(false)} onClick={() => refreshPosts('>')}
                height={30} strokeWidth={0.5} fill={refreshHover ? '#ffb405' : (selector.settings.darkMode ? '#B17EFF': '#8205ff')} style={{ marginLeft: 15 }} className={refreshing ? 'refresh' : ''}/>
            </div>
            {creatingPost ? (
              <PostEditor setCreatingPost={setCreatingPost} refreshPosts={refreshPosts} placeholder={placeholder} />

            ) : (
              null
            )}
            <InfiniteScroll
              dataLength={posts.length}
              next={() => refreshPosts('<')}
              hasMore={hasMore}
              endMessage={<p style={{textAlign: 'center', color: '#820bff '}}>no more posts :(</p>}
              loader={loading ? <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div> : null}
              style={{overflow: 'visible'}}>
              {postItem}
            </InfiniteScroll>
          </div>
          <Profile logout={props.logout} />
          <div style={{width: '20vw'}}/>
        </div>
      </div>
    </div>
  );
}

export default Home;
