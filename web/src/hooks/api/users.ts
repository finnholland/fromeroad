import Axios from "axios";
import { User } from "../../../types";
import { API, JWT_TOKEN } from "../../constants";
import { setUser} from "../slices/userSlice";
import { setProfile, setProfileInterests } from "../slices/profileSlice";

export const updateUserDetails = (dispatch: any, userState: User, userId: number, setUserState: any) => {
  const params = {
    userId: userId,
    name: userState.name,
    project: userState.project,
    phone: userState.phone,
  }

  Axios.post(`${API}/user/updateuser`, params, {
    headers: {
      Authorization: JWT_TOKEN
    }
  }).then(res => {
    setUserState(userState);
    dispatch(setUser(userState))
    return res
  }).catch(err => {
    return err
  })
}

export const getUserProfile = (dispatch: any, userId: number, profileId: number) => {
  const params = {
    userId: userId,
    profileId: profileId,
  }
  Axios.get(`${API}/user/profile`, {
    params: params,
    headers: {
      Authorization: JWT_TOKEN
    }
  }).then(res => {
    dispatch(setProfile(res.data[0]))
  }).catch(err => {
    return err
  });

  Axios.get(`${API}/user/profile/interests/${profileId}`, {
    headers: {
      Authorization: JWT_TOKEN
  }
}).then(res => {
    dispatch(setProfileInterests(res.data))
  }).catch(err => {
    return err
  });
}

export const getRecentPosters = (setActivityLoading: any, setRecentPosters: any) => {
  setActivityLoading(true)
  setRecentPosters([])
  Axios.get(`${API}/recentPosters`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  }).then(res => {
    setRecentPosters(res.data)
    setActivityLoading(false)
  })
}