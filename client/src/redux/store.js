import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootState from './reducers';

const store = createStore(rootState, composeWithDevTools());

export default store;