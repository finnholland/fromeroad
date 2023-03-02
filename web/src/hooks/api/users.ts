import Axios from "axios";
import { ProfileType, User } from "../../../types";
import { API, JWT_TOKEN } from "../../constants";
import { setUser} from "../slices/userSlice";
import { setProfile, setProfileInterests } from "../slices/profileSlice";

export const updateUserDetails = (dispatch: any, userState: User, userID: number, setUserState: any) => {
  const params = {
    userID: userID,
    name: userState.name,
    project: userState.project,
    phone: userState.phone,
  }

  console.log(params)
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

export const getUserProfile = (dispatch: any, userID: number, profileID: number) => {
  const params = {
    userID: userID,
    profileID: profileID,
  }
  Axios.get(`${API}/user/profile`, {
    params: params,
    headers: {
      Authorization: JWT_TOKEN
    }
  }).then(res => {
    dispatch(setProfile(res.data[0]))
    console.log(res.data[0])
  }).catch(err => {
    return err
  });

  Axios.get(`${API}/user/profile/interests/${profileID}`, {
    headers: {
      Authorization: JWT_TOKEN
  }
}).then(res => {
    dispatch(setProfileInterests(res.data))
    console.log(res.data)
  }).catch(err => {
    return err
  });
}