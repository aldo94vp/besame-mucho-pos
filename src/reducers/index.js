import { combineReducers } from 'redux';

import AppOptions from './app-options.reducer';

const reducers = combineReducers({
  options: AppOptions
});

export default reducers;
