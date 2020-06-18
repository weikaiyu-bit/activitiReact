import { list, add, update, remove, listTargetTypes } from './service';

const Model = {
  namespace: 'notificationSettingsModel',
  state: {
    data: [],
    total: 0,
  },

  /* 异步请求 ************************************ */

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(list, payload);
      const response2 = yield call(listTargetTypes, payload);
      const targetTypes = response2.data;
      yield put({
        type: 'list',
        payload: {
          params: payload,
          targetTypes: targetTypes,
          ...response,
        },
      });
    },
    *add({ payload, callback }, { call, put, select }) {
      const response = yield call(add, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.notificationSettingsModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *update({ payload, callback }, { call, put, select }) {
      const response = yield call(update, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.notificationSettingsModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *remove({ payload, callback }, { call, put, select }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.notificationSettingsModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
  },

  /* 同步请求 **************************************************************** */

  reducers: {
    list(state, action) {
      const rv = {
        ...state,
        data: action.payload.data,
        targetTypes: action.payload.targetTypes,
        total: action.payload.count,
        limit: action.payload.limit,
        params: action.payload.params,
      };
      return rv;
    },
    save(state, action) {
      const rv = {
        ...state,
        ...action,
      };
      return rv;
    },
  },
};

export default Model;
