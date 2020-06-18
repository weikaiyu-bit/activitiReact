import { list, add, update, remove, find } from './service';

const Model = {
  namespace: 'msgNotifyModel',
  state: {
    data: [],
    total: 0,
  },

  /* 异步请求 ************************************************************************************* */


  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(list, payload);
      yield put({
        type: 'list',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
    *add({ payload, callback }, { call, put, select }) {
      const response = yield call(add, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.msgNotifyModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *update({ payload, callback }, { call, put, select }) {
      const response = yield call(update, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.msgNotifyModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *remove({ payload, callback }, { call, put, select }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.msgNotifyModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *fetchAll({ payload }, { call, put }) {
      const response = yield call(find, payload);
      yield put({
        type: 'listAll',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
  },

  /* 同步请求 ************************************************************************************* */

  reducers: {
    list(state, action) {
      const rv = {
        ...state,
        ...action.payload,
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
    listAll(state, action) {
      const rv = {
        ...state,
        listAll: action.payload.data,
      };
      return rv;
    },
  },
};

export default Model;
