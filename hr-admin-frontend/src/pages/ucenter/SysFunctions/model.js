import { list, add, update, remove } from './service';
import utils from '../../../dtsea/common/utils';

const Model = {
  namespace: 'sysFunctionsModel',
  state: {
    data: [],
    total: 0,
  },

  /**
   * 异步请求 *************************************************************************************
   * */

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
        const { params } = yield select(state => state.sysFunctionsModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *update({ payload, callback }, { call, put, select }) {
      const response = yield call(update, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.sysFunctionsModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *remove({ payload, callback }, { call, put, select }) {
      console.log("model--> ids: "+payload);
      const response = yield call(remove, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.sysFunctionsModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
  },

  /**
   * 同步请求 *************************************************************************************
   * */

  reducers: {
    list(state, action) {
      const rv = {
        ...state,
        data: action.payload.data,
        tree: utils.listToTree(action.payload.data),
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
