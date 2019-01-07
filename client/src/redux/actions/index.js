import * as actionType from './actionType';

export const setUser = user => {
  return {
    type: actionType.SET_USER,
    payload: {
      currentUser: user
    }
  }
}