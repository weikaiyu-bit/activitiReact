import { list, add, update, remove, listRtCategory } from './service';
import utils from '../../../dtsea/common/utils';

const Model = {
  namespace: 'rtPerformanceModel',
  state: {
    data: [],
    total: 0,
  },


  /** 异步请求 ************************************************************************************* */

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(list, payload);
      if (callback) callback(response)
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
        const { params } = yield select(state => state.talentQueryModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *update({ payload, callback }, { call, put, select }) {
      const response = yield call(update, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.talentQueryModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *remove({ payload, callback }, { call, put, select }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.talentQueryModel);
        yield put({ type: 'fetch', payload: params });
      }
    },

    *fetchRtCategory({ payload, callback }, { call, put }) {
      const response = yield call(listRtCategory, payload);
      if (callback) callback(response);
      yield put({
        type: 'rtCategory',
        payload: {
          params: payload, // 把查询参数存起来，用于自动刷新列表
          ...response, // 把查询结果存储起来
        },
      });
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
        params: action.payload.params,
      };
      console.log("rv",rv)
      return rv;
    },
    save(state, action) {
      const rv = {
        ...state,
        ...action,
      };
      return rv;
    },

    rtCategory(state, action) {
      // 合并state
      const rv = {
        ...state,
        orgData: action.payload.data,
        tree: utils.listToTree(action.payload.data),
        functionsTotal: action.payload.total,
        functionsLimit: action.payload.number,
        functionsParams: action.payload.params,
      };
      return rv;
    },
  },
};


export default Model;
