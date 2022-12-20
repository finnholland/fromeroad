import React, {useEffect, useState} from 'react'
import { User } from '../types';
import './App.css';
import SvgChamonix from './assets/svg/chamonix';
import SvgLotfourteen from './assets/svg/lotfourteen';

const user: User = {
  userID: 1,
  firstName: 'finn',
  lastName: 'holland',
  email: 'finn.holland@chamonix.com',
  company: 'chamonix',
  trendPoints: 0,
  profileImageUrl: ''
}

function App() {
  const [apiMessage, setApiMessage] = useState('')
  useEffect(() => {
    fetch("http://localhost:9000/test")
        .then(res => res.text())
      .then(res => {
        console.log(res);
        setApiMessage(res)
      });
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <div className='lotfourteen'>
          <SvgLotfourteen/>
        </div>
        <div className='titleContainer'>
          <p className='title'>fromeroad</p>
        </div>
        <div className='chamonix' style={{justifyContent: 'flex-end'}}>
          <SvgChamonix/>
        </div>
        
      </header>
      <div style={{ flex: 1, display: 'flex', padding: 40, flexDirection: 'column'}}>
        <div id='body' style={{ flexDirection: 'row', display: 'flex', }}>
          
          <div id='recentPosters' style={{ flex: 1 }}>
            <div className='titleDiv'>
              <p className='sectionTitle'>recent posters</p>
              <hr className='line'/>
            </div>
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
              <img src={require('./assets/images/aws.jpg')} alt='profile' className='profileImage'/>
              <span>hello</span>
              <span>world</span>
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
