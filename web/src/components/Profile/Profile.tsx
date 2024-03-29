import Axios from 'axios';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Interest, User } from '../../../types';
import LogoutIcon from '../../assets/svg/logoutIcon';
import SvgRemoveButton from '../../assets/svg/removeButton';
import SvgAddButton from '../../assets/svg/SvgAddButton';
import { API, DEFAULT_PROFILE_IMAGE, EIGHT_MEGABYTES, S3_BUCKET } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../hooks/Actions';
import { updateUserDetails } from '../../hooks/api/users';
import { convertTrendPoints } from '../../hooks/helpers';
import { profileInitialState, setProfile } from '../../hooks/slices/profileSlice';
import { setInterests } from '../../hooks/slices/userSlice';
import './Profile.css'
import { decrypt, encrypt } from '../../hooks/crypto';

interface Props {
  logout: any
}

export const Profile: React.FC<Props> = (props: Props) => {
  const selector = useAppSelector(state => state)
  const dispatch = useAppDispatch();

  const [userState, setUserState] = useState<User>(selector.user);
  const [editing, setEditing] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(selector.user.profileImageUrl);
  const [interest, setInterest] = useState('');
  const [interestList, setInterestList] = useState<Interest[]>(selector.user.interests);
  const [interestSearch, setInterestSearch] = useState<Interest[]>([]);
  const [removeSvgHover, setRemoveSvgHover] = useState(-1);
  const [logoutHover, setLogoutHover] = useState(false);
  const [addSvgHover, setAddSvgHover] = useState(-2);
  const [interestLoading, setInterestLoading] = useState(true);
  const [showScroll, setShowScroll] = useState(false);
  const [addInterestError, setAddInterestError] = useState('');
  const [errored, setErrored] = useState(false);

  const [closeProfileView, setCloseProfileView] = useState(false);
  
  useEffect(() => {
    getInterests(selector.user.userId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const scrollRef = React.createRef<HTMLInputElement>();
  React.useLayoutEffect(() => {
    if (scrollRef.current) {
      setShowScroll(scrollRef.current.clientHeight < scrollRef.current.scrollHeight);
    }

  }, [scrollRef]);
  
  const interestItems = interestList.map((i) => {
    return (
      <div key={i.interestId} className='interestDiv' onMouseEnter={() => setRemoveSvgHover(i.interestId)}
          onMouseLeave={() => setRemoveSvgHover(-1)} onClick={() => removeInterest(i.interestId)}>
        <span className='interestTitle'>{i.name}</span>
        <SvgRemoveButton height={20} stroke={removeSvgHover === i.interestId ? '#ffb405' : '#c182ff'} />
      </div>
    )
  });

  const profileInterests = selector.profile.interests.map((i) => {
    if (selector.user.interests.some(ui => ui.interestId === i.interestId)) {
      return (
        <div key={i.interestId} className='interestDiv'>
          <span className='interestTitle'>{i.name}</span>
        </div>
      )
    } else {
      return (
        <div key={i.interestId} className='interestDiv' onMouseEnter={() => setAddSvgHover(i.interestId)}
            onMouseLeave={() => setAddSvgHover(-1)} onClick={() => addInterestHelper(i)}>
          <span className='interestTitle'>{i.name}</span>
          <SvgAddButton height={20} strokeWidth={2} stroke={addSvgHover === i.interestId ? '#ffb405' : '#c182ff'} />
        </div>
      )
    }
  });

  const interestSearchResults = interestSearch.map((i) => {
    return (
      <div className='interestDiv' onMouseEnter={() => setAddSvgHover(i.interestId)}
          onMouseLeave={() => setAddSvgHover(-2)} onClick={() => addInterestHelper(i)}>
        <span className='interestTitle'>{i.name}</span>
          <SvgAddButton height={20} stroke={addSvgHover === i.interestId ? '#ffb405' : '#c182ff'} />
      </div>
    )
  });

  const addInterestHelper = (interest: Interest) => {
    if (interest.interestId) {
      let removalArray: Interest[] = interestSearch
      removalArray = removalArray.filter(i => i.interestId !== interest.interestId)
      setInterestSearch(removalArray)
    }
    addInterest(interest.name)
  }

  const removeInterest = (interestId: number) => {
    const params = {
      userId: selector.user.userId,
      interestId: interestId
    }
    Axios.delete(`${API}/user/interests/removeInterests`, {
      data: params,
      headers:
        { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(() => {
      getInterests(selector.user.userId)
    })
  }

  const addInterest = (interest: string) => {
    const params = {
      userId: selector.user.userId,
      name: interest,
    }
    Axios.post(`${API}/user/interests/addInterests`, params, {
      headers:
        { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then((res) => {
      getInterests(selector.user.userId)
      setRemoveSvgHover(-1);
      let removalArray: Interest[] = interestSearch
      removalArray = removalArray.filter(i => i.name !== interest)
      setInterestSearch(removalArray)
    }).catch(err => {
      setAddInterestError('interest already added')
    })
  }

  const getInterests = (userId: number) => {
    setInterestLoading(true)
    Axios.get(`${API}/user/interests/getInterests/${userId}`, {
      headers:
        { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then((res) => {
      dispatch(setInterests(res.data));
      setInterestList(res.data);
      setInterestLoading(false)
    })
  }

  const changeInterestSearch = (search: string) => {
    setInterest(search);
    if (!search || search === '') {
      setInterestSearch([])
    } else {
      Axios.get(`${API}/user/interests/searchInterests/${search.trim()}`, {
        headers:
          { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }).then((res) => {
        const tempArr: Interest[] = []
        res.data.forEach((interest: Interest) => {
          if (interestList.findIndex(i => i.interestId === interest.interestId) === -1) {
            tempArr.push(interest)
          }
        });
        setInterestSearch(tempArr)
      })
    }
    setAddInterestError('')
  }

  const ref = useRef<HTMLInputElement>(null);
  const handleClick = (e: any) => {
    if (ref.current && e.target.id === 'profileImage') {
      ref.current.click();
    }
  }

  const finishEditingDetails = () => {
    updateUserDetails(dispatch, userState, selector.user.userId, setUserState);
    setEditing(false);
  }

  const onError = () => {
    if (!errored) {
      setErrored(true)
      setProfileImageUrl(DEFAULT_PROFILE_IMAGE)
    }
  }

  const uploadImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files[0].size >= EIGHT_MEGABYTES) {
        alert('too large! 8mb or less plz')
        return;
      } else {
        setProfileImageUrl(DEFAULT_PROFILE_IMAGE)
        const fd = new FormData();
        fd.append('file', e.target.files[0])
        fd.append('userId', selector.user.userId.toString())
        Axios.post(`${API}/image/profileImage/${selector.user.userId}`, fd, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }).then(() => {
          Axios.get(`${API}/image/profileImage/${selector.user.userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }).then(res => {
            setProfileImageUrl(res.data[0].profileImageUrl)
          })
        })
      }
    }
  }

  if (selector.profile.email !== '') {
    return (
      <div id='profile' className='profile'>
        <div className='titleDiv'>
          <hr className='line' />
          <SvgRemoveButton style={{marginLeft: 15}} onMouseEnter={() => setCloseProfileView(true)} onMouseLeave={() => setCloseProfileView(false)} height={24} strokeWidth={1}
            onClick={() => { dispatch(setProfile(profileInitialState)); setCloseProfileView(false); setAddSvgHover(-2) }} stroke={closeProfileView ? '#ffb405' : '#8205ff'}/>
        </div>
        <div>
          <div style={{ flexDirection: 'row', display: 'flex', paddingLeft: 10, paddingRight: 10 }}>
            <img src={S3_BUCKET + selector.profile.profileImageUrl} onError={onError} alt='profile' className={selector.settings.darkMode ? 'profileImageDarkMode' : 'profileImage'} />
            <div className='detailsDiv'>
              <p className='name'>{selector.profile.name}</p>
              <p className='company'>{selector.profile.company}</p>
            </div>
          </div>
          <div className='sectionDiv'>
            <p className='sectionHeader'>details</p>
            <hr className='sectionHeaderLine' style={{marginTop: 0}}/>          
          </div>
          <div className='details'>
            <div>
              <p className='detailHeader' style={{marginTop: 0}}>email</p>
              <p className='detailBody'>{selector.profile.email}</p>
            </div>
            <div>
              <p className='detailHeader'>project</p>
              <p className='detailBody'>{selector.profile.project || '-'}</p>
            </div>
            <div>
              <p className='detailHeader'>phone</p>
              <p className='detailBody'>{(selector.profile.phone) || '-'}</p>
            </div>
            <div>
              <p className='detailHeader'>trend points</p>
              <p className='detailBody'>{convertTrendPoints(selector.profile.trendPoints)}</p>
            </div>
          </div>
          <div className='sectionDiv'>
            <p className='sectionHeader'>interests</p>
            <hr className='sectionHeaderLine' style={{marginTop: 0}}/>          
          </div>
          <div ref={scrollRef} id='interestList' className='interestScrollable' style={{paddingRight: (showScroll ? 10 : 18)}}>
            {profileInterests}
            {interestLoading ? <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div> : null}
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div id='profile' className='profile'>
        <div className='titleDiv'>
          <p className={selector.settings.darkMode ? "sectionTitleDarkMode" : "sectionTitle"}>me</p>
          <hr className={selector.settings.darkMode ? "lineDarkMode" : "line"} />
          <LogoutIcon onClick={() => props.logout()} height={24} width={25} style={{ marginLeft: 15, cursor: 'pointer' }}
            onMouseEnter={() => setLogoutHover(true)} onMouseLeave={() => setLogoutHover(false)} stroke={logoutHover ? '#ffb405' : (selector.settings.darkMode ? '#B17EFF' :'#8205ff')} strokeWidth={3} />
        </div>
        <div className='profileDesktop'>
          <div style={{ flexDirection: 'row', display: 'flex', paddingLeft: 10, paddingRight: 10 }}>
            <div className={selector.settings.darkMode ? 'profileImageDarkMode' : 'profileImage'} id='profileImage' onClick={(e) => handleClick(e)}
              style={{ backgroundImage: `url(${S3_BUCKET}${profileImageUrl}), url(${S3_BUCKET}${DEFAULT_PROFILE_IMAGE})`, backgroundSize: 'cover', backgroundPosition: 'center center' }}>
              <div className={selector.settings.darkMode ? 'profileImageOverlayDarkMode' : 'profileImageOverlay'}>
                <span style={{alignItems: 'center', display:'flex', marginBottom: 5}}>change</span>
              </div>
            </div>
            <div className='detailsDiv'>
              <input type={'text'} disabled={!editing} className='name nameInput' style={{ textDecorationLine: (editing) ? 'underline' : 'none' }}
                onChange={(e) => setUserState((prevState) => ({ ...prevState, name: e.target.value }))} value={userState.name} />
              <p className='company'>{selector.user.company}</p>
            </div>
          </div>
          <div className='sectionDiv'>
            <p className='sectionHeader'>details</p>
            <hr className='sectionHeaderLine' style={{ marginTop: 0 }} />
            {editing ? (<div style={{flexDirection: 'row', display: 'flex', alignItems: 'center'}}>
              <p className='sectionHeader' style={{color: '#3fffb9', userSelect: 'none'}} onClick={() => finishEditingDetails()}>save</p>
              <hr className='sectionHeaderLine' style={{ marginTop: 0, width: 10 }} />
            </div>) : (null)}
            
            <p className='sectionHeader' style={{color: (editing ? 'red' : '#FFB405'), userSelect: 'none'}} onClick={() => setEditing(!editing)}>{editing ? 'cancel' : 'edit'}</p>
          </div>
          <div className='details'>
            <div>
              <p className='detailHeader' style={{marginTop: 0}}>email</p>
              <p className='detailBody'>{selector.user.email}</p>
            </div>
            <div>
              <p className='detailHeader'>project</p>
              <input type={'text'} disabled={!editing} placeholder={'-'} className='detailInput' value={userState.project || ''} 
              style={{ textDecorationLine: (editing) ? 'underline' : 'none' }} onChange={(e) => setUserState((prevState) => ({ ...prevState, project: e.target.value }))}/>
            </div>
            <div>
              <p className='detailHeader'>phone</p>
              <input type={'tel'} disabled={!editing} placeholder={'-'} className='detailInput' value={userState.phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')}
              style={{ textDecorationLine: (editing) ? 'underline' : 'none' }} onChange={(e) => setUserState((prevState) => ({ ...prevState, phone: e.target.value }))}
              />
            </div>
            <div>
              <p className='detailHeader'>trend points</p>
              <p className='detailBody'>{convertTrendPoints(selector.user.trendPoints)}</p>
            </div>
          </div>
          <div className='sectionDiv'>
            <p className='sectionHeader'>interests</p>
            <hr className='sectionHeaderLine' style={{marginTop: 0}}/>          
          </div>
          <div className='addInterestDiv'>
            <input type={'text'} placeholder='add interests' className='interestInput' value={interest} onChange={(e) => changeInterestSearch(e.target.value)}/>
            {selector.settings.darkMode ?
              (<SvgAddButton strokeOpacity={addSvgHover === -1 ? '#ffb405' : '#461A77'} fill='#302245' stroke={addSvgHover === -1 ? '#ffb405' : '#9054D0'} height={40} onMouseEnter={() => setAddSvgHover(-1)}
                onMouseLeave={() => setAddSvgHover(-2)} onClick={() => interest.trim() !== '' ? addInterest(interest.trim()) : null} />)
              :
              (<SvgAddButton strokeOpacity={addSvgHover === -1 ? '#ffb405' : '#DECCF0'} stroke={addSvgHover === -1 ? '#ffb405' : '#c182ff'} height={40} onMouseEnter={() => setAddSvgHover(-1)}
                onMouseLeave={() => setAddSvgHover(-2)} onClick={() => interest.trim() !== '' ? addInterest(interest.trim()) : null} />)
            }


          </div>
          <div ref={scrollRef} id='interestList' className='interestScrollable' style={{paddingRight: (showScroll ? 10 : 18)}}>
            {interestSearchResults.length === 0 && interest === '' ? interestItems :
              (
                <div>
                  <div style={{ justifyContent: 'space-between', display: 'flex' }}>
                    <span style={{ fontSize: 12 }}>{ interestSearchResults.length === 0 ? 'no results' : 'results:'}</span>
                    <span style={{ fontSize: 12, color: 'red', cursor: 'pointer' }} onClick={() => changeInterestSearch('')}>clear</span>
                  </div>
                  {interestSearchResults}
                </div>
              )
            }
            {interestLoading ? <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div> : null}
            <span className='errorMessage'>{addInterestError}</span>
          </div>
      </div>
      <input ref={ref} type={'file'} accept="image/png, image/jpeg" name="file" onChange={uploadImage} hidden/>
      </div>
    )
  }

}
