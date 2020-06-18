import { list, add, update, remove, findAll, addNodes } from './service';

const Model = {
  namespace: 'wfNodesModel',
  state: {
    data: [],
    total: 0,
  },

  /** 异步请求 **************************************************************************************/

  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(list, payload);
      if(callback) callback(response)
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
        const { params } = yield select(state => state.wfNodesModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *addNodes({ payload, callback }, { call }) {
      const response = yield call(addNodes, payload);
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put, select }) {
      const response = yield call(update, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.wfNodesModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *remove({ payload, callback }, { call, put, select }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.wfNodesModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *findAll({ payload }, { call, put }) {
      const response = yield call(findAll, payload);
      yield put({
        type: 'all',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
    *findbyid({ payload }, { call, put }) {
      const response = yield call(list, payload);
      yield put({
        type: 'findbyid',
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
    all(state, action) {
      const rv = {
        ...state,
        alldata:action.payload.data

      };
      return rv;
    },
    findbyid(state, action) {
      const rv = {
        ...state,
        findbyiddata:action.payload.data

      };
      return rv;
    },
  },
};

export default Model;
