import * as actionType from '../actions/actionType';

const initialState = {
  currentUser: null,
  isLoading: true
}

const user_reducer = (state = initialState, action) => {
  if(action.type === actionType.SET_USER) {
    return {
      currentUser: action.payload.currentUser,
      isLoading: false
    }
  }
  if(action.type === actionType.STOP_LOADING) {
    return {...state.currentUser, isLoading: false}
  }

  return state;
}

export default user_reducer;