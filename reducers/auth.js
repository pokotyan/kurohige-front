import * as authActions from '../actions/auth';

const initialState = {
  userId: null, // 自身のid
  roomId: null, // 参加しているルームID
  rooms: [], // 参加可能なルームID
  userIds: [] // 参加しているルームに入ってるユーザーID一覧
};

export default (state = initialState, action) => {
  switch (action.type) {
    case authActions.UPDATE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
