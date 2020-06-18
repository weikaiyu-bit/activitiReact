import { list, add, update, remove, listTree } from './service';
import utils from '../../../dtsea/common/utils';

const Model = {
  namespace: 'cmsPublishModel',
  state: {
    data: [],
    total: 0,
  },
  /** *************************************  异步请求 ********************************************** */

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(list, payload);
      console.log('effects', payload);
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
        const { params } = yield select(state => state.cmsPublishModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *update({ payload, callback }, { call, put, select }) {
      const response = yield call(update, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.cmsPublishModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *remove({ payload, callback }, { call, put, select }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.cmsPublishModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *fetchTree({ payload }, { call, put }) {
      const response = yield call(listTree, payload);
      console.log('fetchTree', response);
      yield put({
        type: 'listTree',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
  },

  /** *************************************  同步请求 ***************************************** */

  reducers: {
    list(state, action) {
      const rv = {
        ...state,
        data: action.payload.data,
        total: action.payload.total,
        limit: action.payload.size,
        params: action.payload.params,
      };
      console.log('listRv', rv.params);
      return rv;
    },
    listTree(state, action) {
      const rv = {
        ...state,
        tree: utils.listToTree(action.payload.data),
        categoryData: action.payload.data,
      };
      console.log('listTreeRv', rv);
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
