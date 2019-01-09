import { combineReducers } from 'redux';

import userReducer from './user_reducer';
import channelReducer from './channel_reducer';

const rootState = combineReducers({
  user: userReducer,
  channel: channelReducer
});

export default rootState;