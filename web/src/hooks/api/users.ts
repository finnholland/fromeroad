import Axios from "axios";
import { API, JWT_TOKEN } from "../../constants";
import { setName as setSelectorName} from "../slices/userSlice";

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