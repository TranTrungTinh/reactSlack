import { combineReducers } from 'redux';

import userReducer from './user_reducer';
import channelReducer from './channel_reducer';
import colorReducer from './color_reducer';

const rootState = combineReducers({
  user: userReducer,
  channel: channelReducer,
  color: colorReducer
});

export default rootState;