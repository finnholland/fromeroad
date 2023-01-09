import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { User } from '../../../types';

export const initialState: User = {
  userID: 0,
  name: '',
  email: '',
  company: '',
  trendPoints: 0,
  profileImageUrl: ''
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
  },
});

export const { setUser } = userSlice.actions;


export default userSlice.reducer;

export const selectUser = (state: RootState) => state.user;
