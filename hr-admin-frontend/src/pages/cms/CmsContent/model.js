/* eslint-disable no-console */
import { list, add, update, remove, categorylist } from './service';
import utils from '../../../dtsea/common/utils';

const Model = {
  namespace: 'cmsContentModel',
  state: {
    data: [],
    total: 0,
  },

  /** 异步请求 ************************************************************************************* */

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(list, payload);
      if (callback) callback(response);
      yield put({
        type: 'list',
        payload: {
          params: payload,
          ...response,
        },
      });
    },

    *category({ payload }, { call, put }) {
      const response = yield call(categorylist, payload);
      yield put({
        type: 'listCategory',
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
        const { params } = yield select(state => state.cmsContentModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *update({ payload, callback }, { call, put, select }) {
      const response = yield call(update, payload);
      console.log('response', response);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.cmsContentModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *remove({ payload, callback }, { call, put, select }) {
      console.log('plaload:', payload);
      const response = yield call(remove, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.cmsContentModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
  },

  /** 同步请求 ************************************************************************************* */

  reducers: {
    list(state, action) {
      const rv = {
        ...state,
        ...action.payload,
        // data: action.payload.data,
        // total: action.payload.count,
        // limit: action.payload.limit,
        // params: action.payload.params,
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

    listCategory(state, action) {
      const rv = {
        ...state,
        tree: utils.listToTree(action.payload.data),
        categoryData: action.payload.data,
        params: action.payload.params,
      };
      return rv;
    },
  },
};

export default Model;
