import React, { useEffect, useRef, useState } from 'react'
import { User, Interest } from '../../types';
import '../App.css';
import './Home.css'
import SvgChamonix from '../assets/svg/chamonix';
import SvgLotfourteen from '../assets/svg/lotfourteen';
import SvgRemoveButton from '../assets/svg/removeButton';
import SvgAddButton from '../assets/svg/SvgAddButton';
import Axios from 'axios';

import { getUser, setUser } from '../userData';

const api = 'http://localhost:9000'

function App() {
  const [user, setUser] = useState<User>(getUser);
  const [profileImageUrl, setProfileImageUrl] = useState(getUser().profileImageUrl);
  const [removeSvgHover, setRemoveSvgHover] = useState(-1);
  const [addSvgHover, setAddSvgHover] = useState(false);
  const [interest, setInterest] = useState('');
  const [interestList, setInterestList] = useState<Interest[]>([]);

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
        <SvgRemoveButton 
          height={20} stroke={removeSvgHover === i.interestID ? '#B27D00' : '#AC80D9'} />
      </div>
    )
    });

  useEffect(() => {
    getUserFromToken();
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
      setUser(res.data[0] as User);
      setProfileImageUrl(res.data[0].profileImageUrl);
      getInterests(res.data[0].userID);
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
    Axios.get(`${api}/image/profileImage/${userID}`).then(res => {
      console.log(res)
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
      console.log(res)
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
      console.log(res.data)
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
              <input type={'text'} placeholder='add interests' className='interestInput' onChange={(e) => setInterest(e.target.value)}/>
              <SvgAddButton fill={addSvgHover ? '#B27D00' : '#DECCF0'} stroke={addSvgHover ? '#B27D00' : '#AC80D9'} height={40} onMouseEnter={() => setAddSvgHover(true)}
                onMouseLeave={() => setAddSvgHover(false)} onClick={() => interest.trim() !== '' ? addInterest(interest.trim()) : null} />
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
