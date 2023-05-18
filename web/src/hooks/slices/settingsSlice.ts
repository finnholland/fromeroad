import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface Settings {
  darkMode: boolean
}

export const initialState: Settings = {
  darkMode: false
}

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
  },
});

export const { setDarkMode } = settingsSlice.actions;


export default settingsSlice.reducer;

export const selectUser = (state: RootState) => state.settings;
