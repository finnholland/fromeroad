import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Interest, ProfileType } from '../../../types';

export const profileInitialState: ProfileType = {
  name: '',
  email: '',
  company: '',
  phone: '',
  project: '',
  profileImageUrl: '',
  trendPoints: 0,
  interests: []
};

export const userProfile = createSlice({
  name: 'user',
  initialState: profileInitialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setProfile: (state, action: PayloadAction<ProfileType>) => {
      state.name = action.payload.name
      state.email = action.payload.email
      state.company = action.payload.company
      state.profileImageUrl = action.payload.profileImageUrl
      state.trendPoints = action.payload.trendPoints
      state.phone = action.payload.phone
      state.project = action.payload.project
    },
    setProfileInterests: (state, action: PayloadAction<Interest[]>) => {
      state.interests = action.payload
    },
  },
});

export const { setProfile, setProfileInterests } = userProfile.actions;


export default userProfile.reducer;

export const selectProfile = (state: RootState) => state.profile;
