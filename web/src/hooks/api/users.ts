import Axios from "axios";
import { Profile } from "../../../types";
import { API, JWT_TOKEN } from "../../constants";
import { setName as setSelectorName} from "../slices/userSlice";
import { setProfile, setProfileInterests } from "../slices/profileSlice";

export const updateName = (dispatch: any, name: string, userID: number, setName: any) => {
  const params = {
    userID: userID,
    name: name,
  }
  Axios.post(`${API}/user/updateName`, params, {
    headers: {
      Authorization: JWT_TOKEN
    }
  }).then(res => {
    setName(name)
    dispatch(setSelectorName(name))
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