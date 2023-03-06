import React from 'react';
import SvgChamonix from '../assets/svg/chamonix';
import Hamburger from '../assets/svg/hamburger';
import SvgLotfourteen from '../assets/svg/lotfourteen';
import { useAppDispatch, useAppSelector } from '../hooks/Actions';
import '../App.css'
import { setIsOpen } from '../hooks/slices/sidebarSlice';
import GitHub from '../assets/svg/github';
interface Props {
  type: string
  showGithub: boolean
}


export const Header: React.FC<Props> = (props: Props) => {
  const dispatch = useAppDispatch();
  const selector = useAppSelector(state => state);

  if (props.type === 'desktop') {
    return (
      <div>
        <header className="header">
          <div className='lotfourteen'>
            <a href='http://www.lotfourteen.com.au' target={'_blank'} rel='noreferrer' style={{marginRight: 20}}>
              <SvgLotfourteen height={25} fill={'#fff'}/>
            </a>
            {
              props.showGithub ? (<a href='https://github.com/fhllnd/fromeroad' target={'_blank'} rel='noreferrer'> <GitHub height={25} fill={'#fff'} /> </a>) :
                ( null )
            }

          </div>
          <div className='titleContainer'>
            <p className='title'>frome_road</p>
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
    return (
      <header className="header">
        <button className='hamburger' onClick={() => dispatch(setIsOpen(!selector.sidebar.isOpen))} >
          <Hamburger height={20} width={20} stroke='#fff' strokeWidth={1.5}/>
        </button>
        <div className='titleContainer'>
          <p className='title'>frome_road</p>
        </div>
        <div className='hamburger'>
          <Hamburger height={20} width={20} strokeWidth={1.5}/>
        </div>
      </header>
    )
  }

}
