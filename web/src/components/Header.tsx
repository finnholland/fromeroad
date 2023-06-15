import React from 'react';
import SvgChamonix from '../assets/svg/chamonix';
import Hamburger from '../assets/svg/hamburger';
import SvgLotfourteen from '../assets/svg/lotfourteen';
import { useAppDispatch, useAppSelector } from '../hooks/Actions';
import '../App.css'
import { setIsOpen } from '../hooks/slices/sidebarSlice';
import GitHub from '../assets/svg/github';
import { isMobile } from 'react-device-detect';
import Axios from 'axios';
import { API } from '../constants';
import { setDarkMode } from '../hooks/slices/settingsSlice';
import Lightbulb from '../assets/svg/lightbulb';
interface Props {
  showGithub: boolean
  error?: boolean
}


export const Header: React.FC<Props> = (props: Props) => {
  const dispatch = useAppDispatch();
  const selector = useAppSelector(state => state);

  const updatetoptentemp = () => {
    Axios.get(`${API}/trends/updateTopTen`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then()
  }

  const changeSides = () => {
    dispatch(setDarkMode(!selector.settings.darkMode))
    localStorage.setItem('darkMode', String(!selector.settings.darkMode))
  }

  if (!isMobile) {
    return (
      <div>
        <header className="header">
          <div className='lotfourteen'>
            <a href='http://www.lotfourteen.com.au' target={'_blank'} rel='noreferrer' style={{lineHeight: 0}}>
              <SvgLotfourteen height={25} fill={'#fff'}/>
            </a>
            {
              props.showGithub ? (<a href='https://github.com/fhllnd/fromeroad' style={{marginRight: 20, marginLeft: 20, lineHeight: 0}} target={'_blank'} rel='noreferrer'> <GitHub height={25} fill={'#fff'} /> </a>) :
                ( null )
            }
            <Lightbulb onClick={() => changeSides()} height={25} fill={'#fff'} stroke={selector.settings.darkMode ? '#ABABAB' : '#F9EF00'}/>
            
          </div>
          <div className='titleContainer'>
            <p onClick={() => updatetoptentemp()} className='title'>frome_road</p>
          </div>
          <div className='chamonix' style={{ justifyContent: 'flex-end' }}>
            <a href='http://www.chamonix.com.au' target={'_blank'} rel='noreferrer'>
              <SvgChamonix height={20} fill={'#fff'}/>
            </a>
          </div>
        </header>
        <div id='padding' style={{minHeight: 50}}/>
      </div>

    )
  } else {
    if (props.error) {
      return (
        <header className="header">
          <p className='title'>frome_road</p>
        </header>
      )
    } else {
      return (
        <header className="header">
          <button className='hamburger' onClick={() => dispatch(setIsOpen(!selector.sidebar.isOpen))} >
            <Hamburger height={20} width={20} stroke='#fff' strokeWidth={1.5}/>
          </button>
          <div className='titleContainer'>
            <p onClick={() => updatetoptentemp()} className='title'>frome_road</p>
          </div>
          <div className='hamburger'>
            <Hamburger height={20} width={20} strokeWidth={1.5}/>
          </div>
        </header>
      )
    }

  }

}
