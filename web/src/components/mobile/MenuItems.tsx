import React from 'react'
import SvgChamonix from '../../assets/svg/chamonix'
import SvgLotfourteen from '../../assets/svg/lotfourteen'
import { useAppSelector, useAppDispatch } from '../../redux/Actions'
import { setIsOpen } from '../../redux/slices/sidebarSlice'

interface Props {
  logout: any,
  currentRoute: string
  setCurrentRoute: any
}

export const MenuItems: React.FC<Props> = (props: Props) => {
  const selector = useAppSelector(state => state);
  const dispatch = useAppDispatch();

  const changeRoute = (route: string) => {
    props.setCurrentRoute(route);
    dispatch(setIsOpen(!selector.sidebar.isOpen))
  }

  return (
    <div className='menuItems'>
      <div style={{flexDirection: 'row', display: 'flex', justifyContent: 'space-between', marginBottom: 32}}>
        <a target="_blank" rel="noreferrer" href='http://www.lotfourteen.com.au'>
          <SvgLotfourteen height={15} fill={'#000'} />
        </a>
        <a target="_blank" rel="noreferrer" href='http://www.chamonix.com.au' style={{ justifyContent: 'flex-end' }}>
          <SvgChamonix height={15} fill={'#000'}/>
        </a>
      </div>

      <div className='tabs'>
        <div className='titleDiv' style={{marginBottom: '3rem'}} onClick={() => changeRoute('feed')}>
          <p className={props.currentRoute === 'feed' ? 'activeTitle' : 'sectionTitle'}>feed</p>
          <hr className={props.currentRoute === 'feed' ? 'activeLine' : 'line'}/>
        </div>
        <div className='titleDiv' style={{marginBottom: '3rem'}} onClick={() => changeRoute('activity')}>
          <p className={props.currentRoute === 'activity' ? 'activeTitle' : 'sectionTitle'}>activity</p>
          <hr className={props.currentRoute === 'activity' ? 'activeLine' : 'line'} />
        </div>
        <div className='titleDiv' style={{marginBottom: '3rem'}} onClick={() => changeRoute('interests')}>
          <p className={props.currentRoute === 'interests' ? 'activeTitle' : 'sectionTitle'}>profile</p>
          <hr className={props.currentRoute === 'interests' ? 'activeLine' : 'line'}/>
        </div>
        <div className='titleDiv' style={{marginBottom: '3rem'}} onClick={() => changeRoute('trends')}>
          <p className={props.currentRoute === 'trends' ? 'activeTitle' : 'sectionTitle'}>trends</p>
          <hr className={props.currentRoute === 'trends' ? 'activeLine' : 'line'}/>
        </div>
      </div>
      
      <div>
        <div className='menuButton logoutButton' onClick={() => props.logout()}>
          logout
        </div>
        <div className='menuButton deleteButton' onClick={() => alert('sdsa')}>
          delete account
        </div>
      </div>
    </div>

  )
}
