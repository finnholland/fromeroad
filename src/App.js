import chamonix from './assets/chamonix.svg';
import lotfourteen from './assets/lotfourteen.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className='lotfourteen'>
          <img src={lotfourteen} style={{height: '40%', color: 'white'}} alt="logo" a/>
        </div>
        <div className='titleContainer'>
          <p className='title'>fromeroad</p>
        </div>
        <div className='chamonix' style={{justifyContent: 'flex-end'}}>
          <img src={chamonix} style={{ height: '30%' }} alt="logo" />
        </div>
        
      </header>
      <div style={{ flex: 1, display: 'flex', padding: 40, flexDirection: 'column'}}>
        <body id='body' style={{ flexDirection: 'row', display: 'flex', }}>
          
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

        </body>

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
