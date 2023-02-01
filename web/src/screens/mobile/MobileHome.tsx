import React, { useEffect, useRef, useState } from 'react'
import { Interest, PostItem, Poster, RecentPosterType, TrendingUserType } from '../../../types';
import './MobileStyles.css'
import SvgRemoveButton from '../../assets/svg/removeButton';
import SvgAddButton from '../../assets/svg/SvgAddButton';
import Axios from 'axios';
import { useAppDispatch, useAppSelector } from '../../redux/Actions';
import moment from 'moment';
import { slide as Menu } from 'react-burger-menu'

import { RecentPoster } from '../../components/RecentPoster';
import { TrendingUser } from '../../components/TrendingUser';
import { PostEditor } from '../../components/PostEditor';
import InfiniteScroll from 'react-infinite-scroll-component';
import { API } from '../../constants';
import { setInterests } from '../../redux/slices/userSlice';
import { Header } from '../../components/Header';
import { MobilePost } from '../../components/mobile/MobilePost';
import { MenuItems } from '../../components/mobile/MenuItems';
import { setIsOpen } from '../../redux/slices/sidebarSlice';

const HOUR = 60000 * 60
interface Props {
  logout: any
}

const MobileHome: React.FC<Props> = (props: Props) => {
  const selector = useAppSelector(state => state);
  const dispatch = useAppDispatch();
  const [profileImageUrl, setProfileImageUrl] = useState(selector.user.profileImageUrl);

  const [refreshing, setRefreshing] = useState(false);
  const [creatingPost, setCreatingPost] = useState(false);

  const [posts, setPosts] = useState<PostItem[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(true);

  const ref = useRef<HTMLInputElement>(null);
  const handleClick = (e: any) => {
    if (ref.current && e.target.id === 'profileImage') {
      ref.current.click();
    }
  }

  const postItem = posts.map((i) => {
    return (
      <MobilePost key={i.post.postID} post={i.post} poster={i.poster} />
    )
  });

  useEffect(() => {
    getPosts();
  }, [])

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


  const handleCreatePostClick = () => {
    setCreatingPost(!creatingPost);
    window.scrollTo(0, 0);
  }

  const toggleSidebar = () => {
    dispatch(setIsOpen(!selector.sidebar.isOpen))
  }

  return (
    <div className="mobile" id='mobile'>
      <div style={{position: 'fixed', display: 'flex', width: '100%'}}>
        <Header type={'mobile'}/>
      </div>
      
      <Menu pageWrapId='home' outerContainerId='mobile'
        customBurgerIcon={false}
        isOpen={selector.sidebar.isOpen}
        onClose={toggleSidebar}
        width={'75vw'}
        className='sidebarStyle'
        overlayClassName='sidebarOverlay'>
        <MenuItems logout={props.logout} currentRoute={'feed'} />
      </Menu>
      <div className='home' id='home' >
        <div id='body' style={{ flexDirection: 'row', display: 'flex', flex: 1 }}>
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
