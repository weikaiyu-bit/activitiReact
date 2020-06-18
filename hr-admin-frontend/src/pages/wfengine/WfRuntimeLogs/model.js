import { list, add, update, remove,find } from './service';

const Model = {
  namespace: 'wfRuntimeLogsModel',
  state: {
    data: [],
    total: 0,
  },

  /** 异步请求 **************************************************************************************/

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(list, payload);
      console.log(response)
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
        const { params } = yield select(state => state.wfRuntimeLogsModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *update({ payload, callback }, { call, put, select }) {
      const response = yield call(update, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.wfRuntimeLogsModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *remove({ payload, callback }, { call, put, select }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.wfRuntimeLogsModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *find({ payload,callback }, { call, put }) {
      const response = yield call(find, payload);
      if(callback) callback(response)
      yield put({
        type: 'all',
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
    all(state, action) {
      const rv = {
        ...state,
        alldata: action.payload.data,
        total: action.payload.count,
        limit: action.payload.limit,
        params: action.payload.params,
      };
      return rv;
    },
  },
};

export default Model;
