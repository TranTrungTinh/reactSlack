import * as actionType from '../actions/actionType';

const initialState = {
  currentChannel: null
}

const channel_reducer = (state = initialState, action) => {
  if(action.type === actionType.SET_CURRENT_CHANNEL) {
    return { currentChannel: action.payload.currentChannel }
  }

  return state;
}

export default channel_reducer;