import { list, add, update, remove, findAll, maketree, treeMenu } from './service';

const Model = {
  namespace: 'wfWorkflowCategoriesModel',
  state: {
    data: [],
    total: 0,
    treeData: [],
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
        const { params } = yield select(state => state.wfWorkflowCategoriesModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *update({ payload, callback }, { call, put, select }) {
      const response = yield call(update, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.wfWorkflowCategoriesModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *remove({ payload, callback }, { call, put, select }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.wfWorkflowCategoriesModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *findAll({ payload, callback }, { call, put }) {
      const response = yield call(findAll, payload);
      console.log(response)
      if (callback) callback(response);
      yield put({
        type: 'all',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
    *maketree({ payload, callback }, { call, put }) {
      const response = yield call(maketree, payload);
      console.log(response)
      if (callback) callback(response);
      yield put({
        type: 'root',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
    *treeMenu({ payload, callback }, { call, put }) {
      const response = yield call(treeMenu, payload);
      if (callback) callback(response);
      yield put({
        type: 'treeData',
        payload: {
          params: payload,
          ...response,
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
      return rv;
    },
    save(state, action) {
      const rv = {
        ...state,
        ...action,
      };
      return rv;
    },
    all(state, action) {
      const rvv = {
        ...state,
        data: action.payload.data,
      };
      return rvv;
    },
    root(state, action) {
      const rvv = {
        ...state,
        rootdata: action.payload.data,
      };
      return rvv;
    },
    treeData(state, action) {
      const rvv = {
        ...state,
        treeData: action.payload.data,
      };
      return rvv;
    },
  },
};

export default Model;
