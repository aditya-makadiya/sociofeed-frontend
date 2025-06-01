import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './slices';
// import { injectStore } from '../utils/axiosConfig';

export const store = configureStore({
  reducer: {
    auth: rootReducer,
  },
});

// injectStore(store);