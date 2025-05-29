import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './slices';
import { injectStore } from '../utils/api/axiosConfig';

export const store = configureStore({
  reducer: rootReducer,
});

injectStore(store);