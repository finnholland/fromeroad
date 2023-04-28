import React, { useEffect, useState } from 'react'
import { PostItem, Poster } from '../../../types';
import './MobileStyles.css'
import SvgAddButton from '../../assets/svg/SvgAddButton';
import Axios from 'axios';
import { useAppDispatch, useAppSelector } from '../../hooks/Actions';
import { slide as Menu } from 'react-burger-menu'

import { PostEditor } from '../../components/PostEditor';
import InfiniteScroll from 'react-infinite-scroll-component';
import { API, PALCEHOLDERS } from '../../constants';
import { Header } from '../../components/Header';
import { MobilePost } from '../../components/mobile/MobilePost';
import { MenuItems } from '../../components/mobile/MenuItems';
import { setIsOpen } from '../../hooks/slices/sidebarSlice';
import { MobileActivity } from '../../components/mobile/MobileActivity';
import { MobileInterests } from '../../components/mobile/MobileInterests';
import { MobileTrending } from '../../components/mobile/MobileTrending';
import { renderLinksAndTags } from '../../hooks/posts/postHelpers';
import DOMPurify from 'dompurify';
interface Props {
  logout: any
}

const MobileHome: React.FC<Props> = (props: Props) => {
  const selector = useAppSelector(state => state);
  const dispatch = useAppDispatch();

  const [creatingPost, setCreatingPost] = useState(false);
  const [placeholder, setPlaceholder] = useState('');
  const [loading, setLoading] = useState(true);
  const [initalLoad, setInitialLoad] = useState(true);

  const [posts, setPosts] = useState<PostItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentRoute, setCurrentRoute] = useState('feed');

  const postItem = posts.map((i) => {
    const body = renderLinksAndTags(i.post.body);
    let clean = DOMPurify.sanitize(body, { USE_PROFILES: { html: true }, ALLOWED_TAGS: ['span', 'a'], ADD_ATTR: ['target', 'style'] });
    return (
      <MobilePost key={i.post.postID} post={i.post} poster={i.poster} body={clean} setCurrentRoute={setCurrentRoute}/>
    )
  });

  useEffect(() => {
    getPosts();
    window.scrollTo(0, 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getPosts = () => {
    setLoading(true);
    Axios.get(`${API}/post/get`, {
      params: {
        userID: selector.user.userID,
        sign: '>',
        condition: 0
      },
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
    }).then(res => {
      updatePosts(res.data)
      setInitialLoad(false)
      setLoading(false)
    })
  }

  const refreshPosts = (sign: string) => {
    if (!initalLoad) {
      setLoading(true);
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
        updatePosts(res.data)
        setLoading(false)
        if (res.data.length <= 0) {
          setHasMore(false)
        }
      })
    }
  }

  const updatePosts = (data: any) => {
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
    setPosts([...posts, ...tempPosts])
  }


  const handleCreatePostClick = () => {
    setCreatingPost(!creatingPost);
    window.scrollTo(0, 0);
  }

  const toggleSidebar = () => {
    dispatch(setIsOpen(!selector.sidebar.isOpen))
  }

  const createPost = () => {
    setCreatingPost(!creatingPost);
    setPlaceholder(PALCEHOLDERS[Math.floor(Math.random() * PALCEHOLDERS.length)])
  }

  return (
    <div className="mobile" id='mobile'>
      <div style={{position: 'fixed', display: 'flex', width: '100%'}}>
        <Header showGithub={true} />
      </div>
      
      <Menu pageWrapId='home' outerContainerId='mobile'
        customBurgerIcon={false}
        isOpen={selector.sidebar.isOpen}
        onClose={toggleSidebar}
        width={'75vw'}
        className='sidebarStyle'
        overlayClassName='sidebarOverlay'>
        <MenuItems logout={props.logout} currentRoute={currentRoute} setCurrentRoute={setCurrentRoute} />
      </Menu>
      <div className='home' id='home' >
        <div id='body' style={{ flexDirection: 'row', display: 'flex', flex: 1 }}>
          {
            currentRoute === 'feed' ? (
              <div id='feed' className='feed'>
                <SvgAddButton
                  onClick={() => handleCreatePostClick()}
                  height={50} stroke={creatingPost ? '#ffb405' : '#8205ff'}
                  style={{ marginLeft: 15, position: 'fixed', right: 40, bottom: 40 }}
                  className={creatingPost ? 'creatingPost' : 'cancelPost'} />

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
            ) : currentRoute === 'activity' ? (
              <MobileActivity/>
            ) : currentRoute === 'profile' ? (
              <MobileInterests setCurrentRoute={setCurrentRoute} />
            ) : (
              <MobileTrending/>
            )
          }
  
        </div>
      </div>
    </div>
  );
}

export default MobileHome;
