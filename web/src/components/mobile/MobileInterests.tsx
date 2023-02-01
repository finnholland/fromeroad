import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Interest } from '../../../types';
import SvgRemoveButton from '../../assets/svg/removeButton';
import SvgAddButton from '../../assets/svg/SvgAddButton';
import { API, HOUR } from '../../constants';
import { useAppSelector, useAppDispatch } from '../../redux/Actions';
import { setInterests } from '../../redux/slices/userSlice';

export const MobileInterests = () => {
  const selector = useAppSelector(state => state);
  const dispatch = useAppDispatch();
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

  return (
    <div>MobileInterests</div>
  )
}
