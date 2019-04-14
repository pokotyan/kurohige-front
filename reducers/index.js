import { combineReducers } from 'redux';
import socket from './socket';
import auth from './auth';
import system from './system';

const reducer = combineReducers({
  socket,
  auth,
  system
});

export default reducer;
