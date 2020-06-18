import { queryCurrent, query as queryUsers, logout } from '@/services/user';
import ErrorCode from '../dtsea/common/ErrorCode';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      if (response.code === ErrorCode.SUCCESS) {
        yield put({
          type: 'saveCurrentUser',
          payload: response,
        });
      }
    },
    *logout(_, { call, put }) {
      const response = yield call(logout);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload.data || {},
      };
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;
