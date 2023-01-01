import React, { useEffect, useRef, useState } from 'react'
import { User } from '../../types';
import '../App.css';
import SvgChamonix from '../assets/svg/chamonix';
import SvgLotfourteen from '../assets/svg/lotfourteen';
import Axios from 'axios';

import { getUser, setUser } from '../userData';
import { url } from 'inspector';

function App() {
  const [user, setUser] = useState<User>(getUser);
  const [profileImageUrl, setProfileImageUrl] = useState(getUser().profileImageUrl);

  const ref = useRef<HTMLInputElement>(null);
  const handleClick = (e: any) => {
    if (ref.current) {
      ref.current.click();
    }
  }

  useEffect(() => {
    getUserFromToken();
    console.log(profileImageUrl)
  }, [])

  const getUserFromToken = () => {
    Axios.get('http://localhost:9000/user/autoLogin', {
      headers: {
        authorisation: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => {
      setUser(res.data[0] as User);
      setProfileImageUrl(res.data[0].profileImageUrl)
    })
  }

  const getUsers = () => {
    console.log('calling api')
    Axios.get("http://localhost:9000/recentPosters").then(res => {
      setUser(res.data[0] as User);
      console.log(res)
    })
  }

  const getLoggedInUser = () => {
    console.log('calling api')
    Axios.get(`http://localhost:9000/user/userID/${1}`, {headers: {authorisation: `Bearer ${localStorage.getItem('token')}`}}).then(res => {
      setUser(res.data[0] as User);
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  }

  const uploadImage = (e: any) => {
    const fd = new FormData();
    fd.append('file', e.target.files[0])
    fd.append('userID', user.userID.toString())
    console.log(user.userID)
    Axios.post(`http://localhost:9000/image/profileImage/${user.userID}`, fd, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(() => {
      Axios.get(`http://localhost:9000/image/profileImage/${user.userID}`).then(res => {
        console.log(res.data[0].profileImageUrl)
        setProfileImageUrl(res.data[0].profileImageUrl)
      })
      
    })
  }

  const getImage = (userID: number) => {
    Axios.get(`http://localhost:9000/image/profileImage/${userID}`).then(res => {
      console.log(res)
    })
  }
  return (
    <div className="App">
      <header className="App-header">
          <a href='http://www.lotfourteen.com.au' className='lotfourteen'>
            <SvgLotfourteen height={25} />
          </a>

        <div className='titleContainer'>
          <p className='title'>fromeroad</p>
        </div>
        <a href='http://www.chamonix.com.au' className='chamonix' style={{ justifyContent: 'flex-end' }}>
          <SvgChamonix height={20}/>
        </a>
        
      </header>
      <div style={{ flex: 1, display: 'flex', padding: 40, flexDirection: 'column'}}>
        <div id='body' style={{ flexDirection: 'row', display: 'flex', }}>
          
          <div id='recentPosters' style={{ flex: 1 }}>
            <div className='titleDiv'>
              <p className='sectionTitle'>recent posters</p>
              <hr className='line'/>
            </div>
            <button onClick={() => getUsers()}>get users</button>
            <button onClick={() => getLoggedInUser()}>get logged in</button>
          </div>

          <div id='feed' className='feed'>
            <div className='titleDiv'>
              <p className='sectionTitle'>feed</p>
              <hr className='line'/>
            </div>
          </div>

          <div id='profile' style={{ flex: 1 }}>
            <div className='titleDiv'>
              <p className='sectionTitle'>me</p>
              <hr className='line' />
            </div>
            <div>
              <input ref={ref} type={'file'} name="file" onChange={uploadImage} hidden/>
              <div className='profileImage' onClick={handleClick} style={{ backgroundImage: `url(http://localhost:9000${profileImageUrl})`, backgroundSize: 'cover' }}>
                <div className='profileImageOverlay'>change</div>
              </div>
              <span>{user.firstName}</span>
              <span>{user.lastName}</span>
            </div>
            <hr className='subline'/>
          </div>

        </div>

        <footer>
          <div id='trendsTitle' className='titleDiv'>
            <p className='sectionTitle'>trends</p>
            <hr className='line'/>

          </div>
        </footer>

      </div>
    </div>
  );
}

export default App;
