import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface Sidebar {
  isOpen: boolean
}

export const initialState: Sidebar = {
  isOpen: false
}

export const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setIsOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload
    },
  },
});

export const { setIsOpen } = sidebarSlice.actions;


export default sidebarSlice.reducer;

export const selectUser = (state: RootState) => state.sidebar;
