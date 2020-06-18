import {
  list,
  add,
  update,
  remove,
  findById,
  findProductLog,
  addProductLog,
  find,
} from './service';

const Model = {
  namespace: 'jobProductsModel',
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
    *fetchLog({ payload, callback }, { call, put }) {
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
    *add({ payload, callback }, { call, put, select }) {
      const response = yield call(add, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.jobProductsModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *update({ payload, callback }, { call, put, select }) {
      const response = yield call(update, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.jobProductsModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *remove({ payload, callback }, { call, put, select }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.jobProductsModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *findById({ payload, callback }, { call, put }) {
      const response = yield call(findById, payload);
      if (callback) callback(response);
      yield put({
        type: 'getById',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
    *findProductLog({ payload, callback }, { call, put }) {
      const response = yield call(findProductLog, payload);
      if (callback) callback(response);
      yield put({
        type: 'listProductLog',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
    *addProductLog({ payload, callback }, { call, put, select }) {
      const response = yield call(addProductLog, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.jobProductsModel);
        yield put({ type: 'fetchLog', payload: params });
      }
    },
    *findByExample({ payload, callback }, { call, put }) {
      const response = yield call(find, payload);
      if (callback) callback(response);
      yield put({
        type: 'find',
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
    getById(state, action) {
      const rv = {
        ...state,
        getByIdData: action.payload.data,
      };
      return rv;
    },
    listProductLog(state, action) {
      const rv = {
        ...state,
        productLogData: action.payload.data,
      };
      return rv;
    },
    find(state, action) {
      const rv = {
        ...state,
        findData: action.payload.data,
      };
      return rv;
    },
  },
};

export default Model;
