import { list, add, update, remove, bamDictionary, findTentants } from './service';
import utils from '../../../dtsea/common/utils';

const Model = {
  namespace: 'bamDictDataModel',
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
    *bamDictionary({ payload }, { call, put }) {
      const response = yield call(bamDictionary, payload);
      yield put({
        type: 'dictionary',
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
        const { params } = yield select(state => state.bamDictDataModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *update({ payload, callback }, { call, put, select }) {
      const response = yield call(update, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.bamDictDataModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *remove({ payload, callback }, { call, put, select }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.bamDictDataModel);
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
        dataTree: utils.dataToTree(action.payload.data),
        params: action.payload.params,
      };
      return rv;
    },
    dictionary(state, action) {
      const rv = {
        ...state,
        dictionary: action.payload.data,
        tree: utils.dictIdToTree(action.payload.data),
      };
      console.log('aa', rv);
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
