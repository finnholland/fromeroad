import React, { useEffect, useState } from 'react'
import { User } from '../../types';
import '../App.css';
import SvgChamonix from '../assets/svg/chamonix';
import SvgLotfourteen from '../assets/svg/lotfourteen';
import Axios from 'axios';

const initialUser: User = {
  userID: 1,
  firstName: '',
  lastName: '',
  email: '',
  company: '',
  trendPoints: 0,
  profileImageUrl: ''
}

function App() {
  const [profileImage, setProfileImage] = useState('../assets/images/aws');
  const [apiMessage, setApiMessage] = useState('')
  const [user, setUser] = useState<User>(initialUser)
  useEffect(() => {
    
  }, [])

  const getUsers = () => {
    console.log('calling api')
    Axios.get("http://localhost:9000/recentPosters").then(res => {
      setUser(res.data[0] as User);
      console.log(res)
    })
  }

  const getLoggedInUser = () => {
    console.log('calling api')
    Axios.get(`http://localhost:9000/user/${1}`).then(res => {
      setUser(res.data[0] as User);
      console.log(res)
    })
  }

  const uploadImage = (e: any) => {
    const fd = new FormData();
    fd.append('file', e.target.files[0])
    fd.append('userID', user.userID.toString())
    setProfileImage(URL.createObjectURL(e.target.files[0]));
    console.log(user.userID)
    Axios.post(`http://localhost:9000/image/${user.userID}`, fd, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  const getImage = (userID: number) => {
    Axios.get(`http://localhost:9000/image/profileImage/${userID}`).then(res => {
      setProfileImage('http://localhost:9000' + res.data[0].profileImageUrl)
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
              <input type={'file'} name="file" onChange={uploadImage}/>
                
              <img src={profileImage} alt='profile' className='profileImage'/>
              <button onClick={() => getImage(1)}>get image</button>
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
