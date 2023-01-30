import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { User, Interest } from '../../../types';

export const initialState: User = {
  userID: 0,
  name: '',
  email: '',
  company: '',
  trendPoints: 0,
  profileImageUrl: '',
  interests: []
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.userID = action.payload.userID
      state.name = action.payload.name
      state.email = action.payload.email
      state.company = action.payload.company
      state.trendPoints = action.payload.trendPoints
      state.profileImageUrl = action.payload.profileImageUrl
    },
    setInterests: (state, action: PayloadAction<Interest[]>) => {
      state.interests = action.payload
    }
  },
});

export const { setUser, setInterests } = userSlice.actions;


export default userSlice.reducer;

export const selectUser = (state: RootState) => state.user;
