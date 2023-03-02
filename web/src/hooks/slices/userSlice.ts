import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { User, Interest } from '../../../types';

export const userInitialState: User = {
  userID: 0,
  name: '',
  email: '',
  company: '',
  project: '',
  phone: '',
  trendPoints: 0,
  profileImageUrl: '',
  interests: [],
  verified: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState: userInitialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.userID = action.payload.userID
      state.name = action.payload.name
      state.email = action.payload.email
      state.company = action.payload.company
      state.phone = action.payload.phone
      state.project = action.payload.project
      state.trendPoints = action.payload.trendPoints
      state.profileImageUrl = action.payload.profileImageUrl
      state.verified = action.payload.verified
    },
    setInterests: (state, action: PayloadAction<Interest[]>) => {
      state.interests = action.payload
    },
    setName: (state, action: PayloadAction<string>) => { 
      state.name = action.payload
    }
  },
});

export const { setUser, setInterests, setName } = userSlice.actions;


export default userSlice.reducer;

export const selectUser = (state: RootState) => state.user;
