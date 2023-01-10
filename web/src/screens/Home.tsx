import React, { useEffect, useRef, useState } from 'react'
import { User, Interest, PostItem, Poster, RecentPosterType, TrendingUserType } from '../../types';
import '../App.css';
import './Home.css'
import SvgChamonix from '../assets/svg/chamonix';
import SvgLotfourteen from '../assets/svg/lotfourteen';
import SvgRemoveButton from '../assets/svg/removeButton';
import SvgAddButton from '../assets/svg/SvgAddButton';
import Axios from 'axios';
import { useAppSelector, useAppDispatch } from '../redux/Actions';
import { setUser } from '../redux/slices/userSlice';

import { Post } from '../components/Post';

import { getUser } from '../userData';
import { RecentPoster } from '../components/RecentPoster';
import { TrendingUser } from '../components/TrendingUser';

const api = 'http://localhost:9000'
const HOUR = 60000 * 60

function App() {
  const [user, setUserState] = useState<User>(getUser);
  const [profileImageUrl, setProfileImageUrl] = useState(getUser().profileImageUrl);

  const [removeSvgHover, setRemoveSvgHover] = useState(-1);
  const [addSvgHover, setAddSvgHover] = useState(-2);

  const [interest, setInterest] = useState('');
  const [interestList, setInterestList] = useState<Interest[]>([]);
  const [interestSearch, setInterestSearch] = useState<Interest[]>([]);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [recentPosters, setRecentPosters] = useState<RecentPosterType[]>([]);
  const [trendingUsers, setTrendingUsers] = useState<TrendingUserType[]>([]);


  const selector = useAppSelector(state => state)
  const dispatch = useAppDispatch()

  const ref = useRef<HTMLInputElement>(null);
  const handleClick = (e: any) => {
    if (ref.current) {
      ref.current.click();
    }
  }

  const interestItems = interestList.map((i) => {
    return (
      <div className='interestDiv' onMouseEnter={() => setRemoveSvgHover(i.interestID)}
          onMouseLeave={() => setRemoveSvgHover(-1)} onClick={() => removeInterest(i.interestID)}>
        <span className='interestTitle'>{i.name}</span>
        <SvgRemoveButton height={20} stroke={removeSvgHover === i.interestID ? '#B27D00' : '#AC80D9'} />
      </div>
    )
  });

  const interestSearchResults = interestSearch.map((i) => {
    return (
      <div className='interestDiv' onMouseEnter={() => setAddSvgHover(i.interestID)}
          onMouseLeave={() => setAddSvgHover(-2)} onClick={() => addInterestHelper(i)}>
        <span className='interestTitle'>{i.name}</span>
          <SvgAddButton height={20} stroke={addSvgHover === i.interestID ? '#B27D00' : '#AC80D9'} />
      </div>
    )
  });

  const recentPostersItems = recentPosters.map((i) => {
    return (
      <RecentPoster user={i} />
    )
  });

  const postItem = posts.map((i) => {
    return (
      <Post post={i.post} poster={i.poster} />
    )
  });

  const trendingUserItem = trendingUsers.map((i) => {
    return (
      <TrendingUser user={i} />
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
    getUserFromToken();
    getPosts();
    getRecentPosters();
    getTrendingUsers();
    const trendInterval = setInterval(() => {
      console.log('Logs every minute');
      getTrendingUsers();
    }, HOUR);

  return () => clearInterval(trendInterval);
  }, [])

  const removeInterest = (interestID: number) => {
    Axios.delete(`${api}/user/interests/removeInterests/${user.userID}/${interestID}`, {
      headers:
        { authorisation: `Bearer ${localStorage.getItem('token')}` }
    }).then(() => {
      getInterests(user.userID)
    })
  }

  const getUserFromToken = () => {
    Axios.get('http://localhost:9000/user/autoLogin', {
      headers: {
        authorisation: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => {
      setUserState(res.data[0] as User);
      dispatch(setUser(res.data[0]));
      setProfileImageUrl(res.data[0].profileImageUrl);
      getInterests(res.data[0].userID);
    })
  }

  const getRecentPosters = () => {
        Axios.get(`${api}/recentPosters`, {
      headers: {
        authorisation: `Bearer ${localStorage.getItem('token')}`
      }
        }).then(res => {
      setRecentPosters(res.data)
    })
  }

  const uploadImage = (e: any) => {
    const fd = new FormData();
    fd.append('file', e.target.files[0])
    fd.append('userID', user.userID.toString())
    Axios.post(`${api}/image/profileImage/${user.userID}`, fd, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(() => {
      Axios.get(`http://localhost:9000/image/profileImage/${user.userID}`).then(res => {
        setProfileImageUrl(res.data[0].profileImageUrl)
      })
      
    })
  }

  const addInterest = (interest: string) => {
    const params = {
      userID: user.userID,
      name: interest,
    }
    Axios.post(`${api}/user/interests/addInterests`, params, {
      headers:
        { authorisation: `Bearer ${localStorage.getItem('token')}` }
    }).then((res) => {
      if (res.status !== 409) {
        getInterests(user.userID)
        setRemoveSvgHover(-1)
      } else {
        alert('interest already exists')
      }
    }).catch(err => {
      alert('error: ' + err.response.status + ' - interest already added')
      console.log(err.response.status)
    })
  }

  const getInterests = (userID: number) => {
    Axios.get(`${api}/user/interests/getInterests/${userID}`, {
      headers:
        { authorisation: `Bearer ${localStorage.getItem('token')}` }
    }).then((res) => {
      setInterestList(res.data)
    })
  }

  const changeInterestSearch = (search: string) => {
    setInterest(search);
    if (!search || search === '') {
      setInterestSearch([])
    } else {
      Axios.get(`${api}/user/interests/searchInterests/${search}`, {
        headers:
          { authorisation: `Bearer ${localStorage.getItem('token')}` }
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

  const createPost = () => {
    const post = {
      body:'this is my 2nd post',
      userID: user.userID
    }
    Axios.post(`${api}/post/create`, post, {
      headers: { authorisation: `Bearer ${localStorage.getItem('token')}` } 
    })
  }

  const getPosts = () => {
    Axios.get(`${api}/post/get`, {
      params: { userID: selector.user.userID },
      headers: { authorisation: `Bearer ${localStorage.getItem('token')}` } 
    }).then(res => {
      const tempPosts: PostItem[] = []
      res.data.forEach((p: any) => {
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
            imageUrl: p.imageUrl || undefined,
            createdAt: p.createdAtUnix,
            voted: !!p.vote
          },
          poster: poster
        }
        tempPosts.push(post);
      });
      setPosts(tempPosts)
    })
  }

  const getTrendingUsers = () => {
    Axios.get(`${api}/trends/`, {
      headers:
        { authorisation: `Bearer ${localStorage.getItem('token')}` }
    }).then((res) => {
      setTrendingUsers(res.data)
    })
  }

  return (
    <div className="App">
      <header className="App-header">
          <a target="_blank" rel="noreferrer" href='http://www.lotfourteen.com.au' className='lotfourteen'>
            <SvgLotfourteen height={25} />
          </a>

        <div className='titleContainer'>
          <p className='title'>frome_road</p>
        </div>
        <a target="_blank" rel="noreferrer" href='http://www.chamonix.com.au' className='chamonix' style={{ justifyContent: 'flex-end' }}>
          <SvgChamonix height={20}/>
        </a>
        
      </header>
      <div style={{ flex: 1, display: 'flex', padding: 40, paddingTop: 20, flexDirection: 'column'}}>
        <div id='body' style={{ flexDirection: 'row', display: 'flex', flex: 6, paddingBottom: 100}}>
          
          <div id='recentPosters' style={{ flex: 1 }}>
            <div className='titleDiv'>
              <p className='sectionTitle'>activity</p>
              <hr className='line'/>
            </div>
            {recentPostersItems}
          </div>
          <div id='feed' className='feed'>
            <div className='titleDiv'>
              <p className='sectionTitle'>feed</p>
              <hr className='line'/>
            </div>
            <button onClick={() => createPost()}>create post</button>
            {postItem}
          </div>

          <div id='profile' style={{ flex: 1 }}>
            <div className='titleDiv'>
              <p className='sectionTitle'>me</p>
              <hr className='line' />
            </div>
            <div style={{ flexDirection: 'row', display: 'flex'}}>
              <div>
                <input ref={ref} type={'file'} name="file" onChange={uploadImage} hidden/>
                <div className='profileImage' onClick={handleClick} style={{ backgroundImage: `url(http://localhost:9000${profileImageUrl})`, backgroundSize: 'cover' }}>
                  <div className='profileImageOverlay'>
                    <span style={{alignItems: 'center', display:'flex', marginBottom: 5}}>change</span>
                  </div>
                </div>
              </div>
              <div className='detailsDiv'>
                <p className='name'>{user.name}</p>
                <p className='company'>{user.company}</p>
              </div>

            </div>
            <hr className='subline' />
            <div style={{ display: 'flex', flex: 1, padding: 10, flexDirection: 'column' }}>
              {interestItems}
            </div>
            <div className='addInterestDiv'>
              <input type={'text'} placeholder='add interests' className='interestInput' value={interest} onChange={(e) => changeInterestSearch(e.target.value)}/>
              <SvgAddButton fill={addSvgHover === -1 ? '#B27D00' : '#DECCF0'} stroke={addSvgHover === -1 ? '#B27D00' : '#AC80D9'} height={40} onMouseEnter={() => setAddSvgHover(-1)}
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

        <footer style={{justifySelf: 'end', flex: 1, position: 'fixed', bottom: 0, left: 40, right: 40, display: 'flex', backgroundColor: 'white', flexDirection: 'column'}}>
          <div id='trendsTitle' className='titleDiv' style={{marginTop: 0}}>
            <p className='sectionTitle'>trends</p>
            <hr className='line'/>
          </div>
          <div style={{flexDirection: 'row', display: 'flex', justifyContent: 'space-between'}}>
            {trendingUserItem}
          </div>         
        </footer>

      </div>
    </div>
  );
}

export default App;
