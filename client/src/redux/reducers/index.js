import { combineReducers } from 'redux';
import userReducer from './user_reducer';

const rootState = combineReducers({
  user: userReducer
});

export default rootState;