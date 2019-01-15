import * as actionType from '../actions/actionType';

const initialState = {
  primaryColor: '#4c3c4c',
  secondaryColor: '#eee'
}

const color_reducer = (state = initialState, action) => {
  if(action.type === actionType.SET_USER_COLORS) {
    return {
      primaryColor: action.payload.primaryColor,
      secondaryColor: action.payload.secondaryColor
    }
  }

  return state;
}

export default color_reducer;