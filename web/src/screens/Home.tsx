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
import { API } from '../constants';
import { Header } from '../components/Header';
import { Profile } from '../components/Profile/Profile';
import * as DOMPurify from 'dompurify';

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

  const [posts, setPosts] = useState<PostItem[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const [trendingUsers, setTrendingUsers] = useState<TrendingUserType[]>([]);

  const [loading, setLoading] = useState(true);
  const [trendingLoading, setTrendingLoading] = useState(true);

    interface Link {
    fullUrl: string,
    domain: string
  }

  const renderLinksAndTags = (body: string) => {
    let bodyLinks: Link[] = [];
    body = body.replace(/([^\s]+:\/\/)/, '');

    const matches = body.match(/((?:[a-z\d]+\.(?:(?!\ ).)*))((?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))?/gm)
    if (matches && matches.length > 0) {

      matches.forEach(url => {
        let tempUrl = url.split(/((?:[a-z\d]+\.(?:(?!\/).)*))((?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))?/gm)
        tempUrl = tempUrl.filter(function (e) { return e });
        const tempLink: Link = {
          fullUrl: tempUrl[0] + (tempUrl[1] ? tempUrl[1] : ''),
          domain: tempUrl[0]
        }
        bodyLinks.push(tempLink);
      });
    }
    console.log(bodyLinks)
    bodyLinks?.forEach(url => {
      if (body.includes(url.fullUrl)) {
        body = body.replace(url.fullUrl, `<a href='//${url.fullUrl}' target='_blank' rel='noreferrer'>${url.domain}</a>`)
      }
    })
    console.log(body)
    // create a span with body, when the text is in the regex match group, close span and replace with anchor tag
    return body;
  }

  const postItem = posts.map((i) => {
    console.log(i.post.body)
    const body = renderLinksAndTags(i.post.body);
    let clean = DOMPurify.sanitize(body, { USE_PROFILES: { html: true }, ADD_ATTR: ['target'] });
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

    const postwithlinks = [
     { postID: 1, body: 'ftp://www.stackoverflow.com/questions/3850074/regex-until-but-not-including' },
    { postID: 2, body: 'this is a link to regex101.com i love this site! www.stackoverflow.com/questions/3850074/regex-until-but-not-including awd www.bom.gov.au wadawda' },
     { postID: 3, body: 'http://www.bom.gov.au/' }
  ]

  const renderLinks = postwithlinks.map((i) => {
    const body = renderLinksAndTags(i.body);
    let clean = DOMPurify.sanitize(body, { USE_PROFILES: { html: true } });
    return (
      <div style={{marginBottom: 40}}>
        <span dangerouslySetInnerHTML={{__html: clean}} />
      </div>
    )
  });

  return (
    <div className="app">
      <Header showGithub={true} />
      <div className='home'>
        <div id='body' style={{ flexDirection: 'row', display: 'flex', paddingTop: 20, justifyContent: 'space-between'}}>
          <div id='topten' className='topTenList'>
            <div className='titleDiv'>
              <p className='sectionTitle'>top ten</p>
              <hr className='line'/>
            </div>
            <div className='topTenScrollable'>
              {trendingLoading ? <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div> : null}
              {trendingUserItem}
            </div>
          </div>
          <div style={{width: '20vw'}}/>
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
              endMessage={<p style={{textAlign: 'center', color: '#820bff '}}>no more posts :(</p>}
              loader={loading ? <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div> : null}
              style={{overflow: 'visible'}}>
              {postItem}
            </InfiniteScroll>
            {renderLinks}
          </div>
          <Profile logout={props.logout} />
          <div style={{width: '20vw'}}/>
        </div>
      </div>
    </div>
  );
}

export default Home;
