import Axios from 'axios';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Interest, User } from '../../../types';
import SvgRemoveButton from '../../assets/svg/removeButton';
import SvgAddButton from '../../assets/svg/SvgAddButton';
import { API, EIGHT_MEGABYTES } from '../../constants';
import { useAppSelector, useAppDispatch } from '../../hooks/Actions';
import { updateUserDetails } from '../../hooks/api/users';
import { convertTrendPoints } from '../../hooks/helpers';
import { setProfile, profileInitialState } from '../../hooks/slices/profileSlice';
import { setInterests } from '../../hooks/slices/userSlice';
import '../Profile/Profile.css'
import './MobileProfile.css'
import { decrypt } from '../../hooks/crypto';

interface Props {
  setCurrentRoute: any
}

export const MobileInterests: React.FC<Props> = (props: Props) => {
  const selector = useAppSelector(state => state);
  const dispatch = useAppDispatch();

  const ref = useRef<HTMLInputElement>(null);
  const handleClick = (e: any) => {
    if (ref.current && e.target.id === 'profileImage') {
      ref.current.click();
    }
  }
  
  const [userState, setUserState] = useState<User>(selector.user);
  const [editing, setEditing] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(selector.user.profileImageUrl);
  const [interest, setInterest] = useState('');
  const [interestList, setInterestList] = useState<Interest[]>([]);
  const [interestSearch, setInterestSearch] = useState<Interest[]>([]);
  const [addSvgHover, setAddSvgHover] = useState(-2);
  const [interestLoading, setInterestLoading] = useState(true);
  const [addInterestError, setAddInterestError] = useState('')

  const interestItems = interestList.map((i) => {
    return (
      <div key={i.interestId} className='interestDiv' onClick={() => removeInterest(i.interestId)}>
        <span className='interestTitle'>{i.name}</span>
        <SvgRemoveButton height={20} stroke='#c182ff' />
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
      <div className='interestDiv' onClick={() => addInterestHelper(i)}>
        <span className='interestTitle'>{i.name}</span>
          <SvgAddButton height={20} stroke={'#c182ff'} />
      </div>
    )
  });

  useEffect(() => {
    getInterests(selector.user.userId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        setAddInterestError('interest already exists')
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
      Axios.get(`${API}/user/interests/searchInterests/${search}`, {
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

  const uploadImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files[0].size >= EIGHT_MEGABYTES) {
        alert('too large! 8mb or less plz')
        return;
      } else {
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

  const finishEditingDetails = () => {
    updateUserDetails(dispatch, userState, selector.user.userId, setUserState);
    setEditing(false);
  }
  if (selector.profile.email !== '') {
    return (
      <div className='profileMobile subPageContainer'>
        <div id='profile' style={{ flex: 1 }}>
          <div className='titleDiv'>
            <hr className='line' />
            <SvgRemoveButton style={{marginLeft: 15}} 
              onClick={() => { dispatch(setProfile(profileInitialState)); props.setCurrentRoute('feed') }} height={24} strokeWidth={1} stroke={'#8205ff'} />
          </div>
          <div style={{ flexDirection: 'row', display: 'flex', paddingLeft: 10, paddingRight: 10 }}>
            <img src={API + selector.profile.profileImageUrl} alt='profile' className='profileImage' />
            <div className='detailsDiv'>
              <p className='name'>{selector.profile.name}</p>
              <p className='company'>{selector.profile.company}</p>
            </div>
          </div>

          <div className='sectionDiv'>
            <p className='sectionHeader'>details</p>
            <hr className='sectionHeaderLine' style={{ marginTop: 0 }} />
          </div>
          <div className='details'>
            <div>
              <p className='detailHeader' style={{ marginTop: 0 }}>email</p>
              <p className='detailBody'>{selector.profile.email}</p>
            </div>
            <div>
              <p className='detailHeader'>project</p>
              <input type={'text'} disabled={!editing} placeholder={'-'} className='detailInput' value={userState.project}
                style={{ textDecorationLine: (editing) ? 'underline' : 'none' }} onChange={(e) => setUserState((prevState) => ({ ...prevState, project: e.target.value }))} />
            </div>
            <div>
              <p className='detailHeader'>phone</p>
              <input type={'tel'} disabled={!editing} placeholder={'-'} className='detailInput' value={decrypt(userState.phone) || '-'}
                style={{ textDecorationLine: (editing) ? 'underline' : 'none' }} onChange={(e) => setUserState((prevState) => ({ ...prevState, phone: e.target.value }))}
              />
            </div>
            <div>
              <p className='detailHeader'>trend points</p>
              <p className='detailBody'>{convertTrendPoints(selector.profile.trendPoints)}</p>
            </div>
          </div>
          <div className='sectionDiv'>
            <p className='sectionHeader'>interests</p>
            <hr className='sectionHeaderLine' style={{ marginTop: 0 }} />
          </div>
          <div id='interestList' className='interestScrollable'>
            {interestLoading ? <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div> : profileInterests}
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className='profileMobile subPageContainer'>
        <div id='profile' style={{ flex: 1 }}>
          <div>
            <div style={{ flexDirection: 'row', display: 'flex' }}>
              <div>
                <div className='profileImage' id='profileImage' onClick={(e) => handleClick(e)} style={{ backgroundImage: `url(${API}${profileImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center center' }}>
                  <div className='profileImageOverlay'>
                    <span style={{ alignItems: 'center', display: 'flex', marginBottom: 5, color: '#fff' }}>change</span>
                  </div>
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
              {editing ? (<div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
                <p className='sectionHeader' style={{ color: '#3fffb9', userSelect: 'none' }} onClick={() => finishEditingDetails()}>save</p>
                <hr className='sectionHeaderLine' style={{ marginTop: 0, width: 10 }} />
              </div>) : (null)}
              <p className='sectionHeader' style={{ color: (editing ? 'red' : '#FFB405'), userSelect: 'none' }} onClick={() => setEditing(!editing)}>{editing ? 'cancel' : 'edit'}</p>
            </div>
            <div className='details'>
              <div>
                <p className='detailHeader' style={{ marginTop: 0 }}>email</p>
                <p className='detailBody'>{selector.user.email}</p>
              </div>
              <div>
                <p className='detailHeader'>project</p>
                <input type={'text'} disabled={!editing} placeholder={'-'} className='detailInput' value={userState.project}
                  style={{ textDecorationLine: (editing) ? 'underline' : 'none' }} onChange={(e) => setUserState((prevState) => ({ ...prevState, project: e.target.value }))} />
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
              <hr className='sectionHeaderLine' style={{ marginTop: 0 }} />
            </div>
            <div className='addInterestDiv'>
              <input type={'text'} placeholder='add interests' className='interestInput' value={interest} onChange={(e) => changeInterestSearch(e.target.value)} />
              <SvgAddButton fill={addSvgHover === -1 ? '#ffb405' : '#DECCF0'} stroke={addSvgHover === -1 ? '#ffb405' : '#c182ff'} height={40} onMouseEnter={() => setAddSvgHover(-1)}
                onMouseLeave={() => setAddSvgHover(-2)} onClick={() => interest.trim() !== '' ? addInterest(interest.trim()) : null} />
            </div>
            <div id='interestList' className='interestScrollable'>
              {interestSearchResults.length === 0 && interest === '' ? interestItems :
                (
                  <div className='mobileSuggestions'>
                    <div style={{ justifyContent: 'space-between', display: 'flex', marginBottom: '1rem' }}>
                      <span style={{ fontSize: 13 }}>{interestSearchResults.length === 0 ? 'no results' : 'results:'}</span>
                      <span style={{ fontSize: 13, color: 'red', cursor: 'pointer' }} onClick={() => changeInterestSearch('')}>clear</span>
                    </div>
                    {interestSearchResults}
                  </div>
                )
              }
              {interestLoading ? <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div> : null}
            </div>
            <span className='errorMessage'>{addInterestError}</span>
          </div>
        </div>
        <input ref={ref} type={'file'} accept="image/png, image/jpeg" name="file" onChange={uploadImage} hidden />
      </div>
    )
  }
}
