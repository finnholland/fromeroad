import Axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { Interest } from '../../../types';
import SvgRemoveButton from '../../assets/svg/removeButton';
import SvgAddButton from '../../assets/svg/SvgAddButton';
import { API } from '../../constants';
import { useAppSelector, useAppDispatch } from '../../redux/Actions';
import { setInterests } from '../../redux/slices/userSlice';

export const MobileInterests = () => {
  const selector = useAppSelector(state => state);
  const dispatch = useAppDispatch();

  const ref = useRef<HTMLInputElement>(null);
  const handleClick = (e: any) => {
    if (ref.current && e.target.id === 'profileImage') {
      ref.current.click();
    }
  }

  const [profileImageUrl, setProfileImageUrl] = useState(selector.user.profileImageUrl);
  const [interest, setInterest] = useState('');
  const [interestList, setInterestList] = useState<Interest[]>([]);
  const [interestSearch, setInterestSearch] = useState<Interest[]>([]);
  
  const interestItems = interestList.map((i) => {
    return (
      <div key={i.interestID} className='interestDiv' onClick={() => removeInterest(i.interestID)}>
        <span className='interestTitle'>{i.name}</span>
        <SvgRemoveButton height={20} stroke='#c182ff' />
      </div>
    )
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
    getInterests(selector.user.userID);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addInterest = (interest: string) => {
    const params = {
      userID: selector.user.userID,
      name: interest,
    }
    Axios.post(`${API}/user/interests/addInterests`, params, {
      headers:
        { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then((res) => {
      if (res.status !== 409) {
        getInterests(selector.user.userID)
      } else {
        alert('interest already exists')
      }
    }).catch(err => {
      alert('error: ' + err.response.status + ' - interest already added')
    })
  }

  const getInterests = (userID: number) => {
    Axios.get(`${API}/user/interests/getInterests/${userID}`, {
      headers:
        { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then((res) => {
      dispatch(setInterests(res.data));
      setInterestList(res.data)
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
          if (interestList.findIndex(i => i.interestID === interest.interestID) === -1) {
            tempArr.push(interest)
          }
        });
        setInterestSearch(tempArr)
      })
    }
  }

  const addInterestHelper = (interest: Interest) => {
    if (interest.interestID) {
      let removalArray: Interest[] = interestSearch
      removalArray = removalArray.filter(i => i.interestID !== interest.interestID)
      setInterestSearch(removalArray)
    }
    addInterest(interest.name)
  }
  
  const removeInterest = (interestID: number) => {
    Axios.delete(`${API}/user/interests/removeInterests/${selector.user.userID}/${interestID}`, {
      headers:
        { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(() => {
      getInterests(selector.user.userID)
    })
  }

  const uploadImage = (e: any) => {
    const fd = new FormData();
    fd.append('file', e.target.files[0])
    fd.append('userID', selector.user.userID.toString())
    Axios.post(`${API}/image/profileImage/${selector.user.userID}`, fd, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(() => {
      Axios.get(`${API}/image/profileImage/${selector.user.userID}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => {
        setProfileImageUrl(res.data[0].profileImageUrl)
      })
    })
  }

  return (
    <div className='interests subPageContainer'>
        <div id='profile' style={{ flex: 1 }}>
          <div className='titleDiv'>
            <p className='sectionTitle'>me</p>
            <hr className='line' />
          </div>
            <div>
              <div style={{ flexDirection: 'row', display: 'flex' }}>
                <div>
                  <div className='profileImage' id='profileImage' onClick={(e) => handleClick(e)} style={{ backgroundImage: `url(${API}${profileImageUrl})`, backgroundSize: 'cover' }}>
                    <div className='profileImageOverlay'>
                      <span style={{alignItems: 'center', display:'flex', marginBottom: 5, color: '#fff'}}>change</span>
                    </div>
                  </div>
                </div>
                <div className='detailsDiv'>
                  <p className='name'>{selector.user.name}</p>
                  <p className='company'>{selector.user.company}</p>
                </div>

              </div>
              <hr className='subline' />
              <div style={{ display: 'flex', flex: 1, padding: 10, flexDirection: 'column' }}>
                {interestItems}
              </div>
              <div className='addInterestDiv'>
                <input type={'text'} placeholder='add interests' className='interestInput' value={interest} onChange={(e) => changeInterestSearch(e.target.value)}/>
                <SvgAddButton fill={'#DECCF0'} stroke={'#c182ff'} height={40} onClick={() => interest.trim() !== '' ? addInterest(interest.trim()) : null} />

              </div>
              <div style={{ display: 'flex', flex: 1, padding: 10, flexDirection: 'column', textAlign: 'left' }}>
                {
                  interestSearchResults.length !== 0 ?
                    <div style={{justifyContent: 'space-between', display: 'flex'}}>
                      <span style={{ fontSize: 12 }}>suggestions:</span>
                      <span style={{ fontSize: 12, color: 'red', cursor: 'pointer' }} onClick={() => changeInterestSearch('')}>clear</span>
                    </div>
                  
                  : null
                }
                {interestSearchResults}
              </div>
            <hr className='subline'/>
          </div>
        </div>
      <input ref={ref} type={'file'} name="file" onChange={uploadImage} hidden/>
    </div>
  )
}
