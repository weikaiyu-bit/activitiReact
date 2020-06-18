/* eslint-disable @typescript-eslint/no-unused-vars */
import { list, add, update, remove, clist, listpid } from './service';
import utils from '../../../dtsea/common/utils';

const Model = {
  namespace: 'bamAreaModel',
  state: {
    data: [],
    total: 0,
  },

  /** 异步请求 ************************************************************************************* */

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(list, payload);
      console.log('payload', payload);
      yield put({
        type: 'list',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
    *listpid({ payload }, { call, put }) {
      const response = yield call(list, payload);
      console.log('payload', payload);
      yield put({
        type: 'listp',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
    *clist({ payload, callback }, { call, put }) {
      const response = yield call(clist, payload);
      console.log('2');
      yield put({
        type: 'cdlist',
        payload: {
          params: payload,
          ...response,
        },
      });
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call, put, select }) {
      const response = yield call(add, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.bamAreaModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *update({ payload, callback }, { call, put, select }) {
      const response = yield call(update, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.bamAreaModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *remove({ payload, callback }, { call, put, select }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.bamAreaModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
  },

  /** 同步请求 ************************************************************************************* */

  reducers: {
    list(state, action) {
      const rv = {
        ...state,
        data: action.payload.data,
        total: action.payload.total,
        limit: action.payload.limit,
        tree: utils.eTotree(action.payload.data),
        params: action.payload.params,
      };
      return rv;
    },
    listp(state, action) {
      const rv = {
        ...state,
        data: action.payload.data,
        total: action.payload.total,
        limit: action.payload.limit,
        tree: utils.eTotree(action.payload.data),
        params: action.payload.params,
      };
      return rv;
    },
    cdlist(state, action) {
      const rv = {
        ...state,
        // cdata: action.payload.data,
        cdata: utils.eTotree(action.payload.data),
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
