import { list, add, update, remove, makeTree } from './service';

const Model = {
  namespace: 'jobProjectCategoryModel',
  state: {
    data: [],
    total: 0,
  },

  /** 异步请求 **************************************************************************************/

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
        const { params } = yield select(state => state.jobProjectCategoryModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *update({ payload, callback }, { call, put, select }) {
      const response = yield call(update, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.jobProjectCategoryModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *remove({ payload, callback }, { call, put, select }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.jobProjectCategoryModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *makeTree({ payload, callback }, { call, put }) {
      const response = yield call(makeTree, payload);
      if (callback) callback(response);
      yield put({
        type: 'tree',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
  },

  /** 同步请求 **************************************************************************************/

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
    tree(state, action) {
      const rv = {
        ...state,
        treeData: action.payload.data,
      };
      return rv;
    },
  },
};

export default Model;
