/* eslint-disable max-len */
import { list, add, update, remove } from './service';

const Model = {
  namespace: 'passprotClaimRecordModel',
  state: {
    data: [],
    total: 0,
  },

  /** �첽���� ************************************************************************************* */

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
        const { params } = yield select(state => state.passprotClaimRecordModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *update({ payload, callback }, { call, put, select }) {
      const response = yield call(update, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.passprotClaimRecordModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *remove({ payload, callback }, { call, put, select }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.passprotClaimRecordModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
  },

  /** ͬ������ ************************************************************************************* */

  reducers: {
    list(state, action) {
      const rv = {
        ...state,
        data: action.payload.data,
        total: action.payload.total,
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
