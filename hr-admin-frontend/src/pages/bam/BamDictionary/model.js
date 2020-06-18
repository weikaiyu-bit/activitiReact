/* eslint-disable no-undef */
import { list, add, update, remove, findTentants } from './service';
import utils from '../../../dtsea/common/utils';

const Model = {
  namespace: 'bamDictionaryModel',
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
    *fetchTentans({ payload }, { call, put }) {
      const response = yield call(findTentants, payload);
      yield put({
        type: 'tentans',
        payload: {
          params: payload, // 把查询参数存起来，用于自动刷新列表
          ...response, // 把查询结果存储起来
        },
      });
    },
    *add({ payload, callback }, { call, put, select }) {
      const response = yield call(add, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.bamDictionaryModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *update({ payload, callback }, { call, put, select }) {
      const response = yield call(update, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.bamDictionaryModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *remove({ payload, callback }, { call, put, select }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.bamDictionaryModel);
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
        // tree: utils.addToTree(action.payload.data),
        params: action.payload.params,
      };
      return rv;
    },
    tentans(state, action) {
      const rv = {
        ...state,
        tentants: action.payload.data,
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
