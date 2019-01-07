import { combineReducers } from 'redux';
import userReducer from './user_reducer';

const rootState = combineReducers({
  userReducer
});

export default rootState;