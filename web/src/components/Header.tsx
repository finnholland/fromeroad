import React from 'react';
import SvgChamonix from '../assets/svg/chamonix';
import Hamburger from '../assets/svg/hamburger';
import SvgLotfourteen from '../assets/svg/lotfourteen';
import { useAppDispatch, useAppSelector } from '../redux/Actions';
import '../App.css'
import { setIsOpen } from '../redux/slices/sidebarSlice';
interface Props {
  type: string
}


export const Header: React.FC<Props> = (props: Props) => {
  const dispatch = useAppDispatch();
  const selector = useAppSelector(state => state);

  if (props.type === 'desktop') {
    return (
      <header className="header">
        <a href='http://www.lotfourteen.com.au' className='lotfourteen'>
          <SvgLotfourteen height={25} fill={'#fff'}/>
        </a>
        <div className='titleContainer'>
          <p className='title'>frome_road</p>
        </div>
        <a href='http://www.chamonix.com.au' className='chamonix' style={{ justifyContent: 'flex-end' }}>
          <SvgChamonix height={20} fill={'#fff'}/>
        </a>
      </header>
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
