import * as actionType from '../actions/actionType';

const initialState = {
  currentChannel: null,
  isPrivateChannel: false
}

const channel_reducer = (state = initialState, action) => {
  if(action.type === actionType.SET_CURRENT_CHANNEL) {
    return {
      ...state, 
      currentChannel: action.payload.currentChannel 
    }
  }

  if(action.type === actionType.SET_PRIVATE_CHANNEL) {
    return { 
      ...state, 
      isPrivateChannel: action.payload.isPrivateChannel 
    }
  }

  return state;
}

export default channel_reducer;