import { list, add, update, remove, listLogs,find } from './service';

const Model = {
  namespace: 'wfRuntimesModel',
  state: {
    data: [],
    total: 0,
  },

  /* 异步请求 ***************************************************** */

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
        const { params } = yield select(state => state.wfRuntimesModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *update({ payload, callback }, { call, put, select }) {
      const response = yield call(update, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.wfRuntimesModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *remove({ payload, callback }, { call, put, select }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.wfRuntimesModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *fetchLogs({ payload }, { call, put }) {
      console.log('fetchLogs');
      const response = yield call(listLogs, payload);
      yield put({
        type: 'listLogs',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
    *find({ payload, callback }, { call, put }) {
      const response = yield call(find, payload);
      if(callback) callback(response)
      yield put({
        type: 'list',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
  },
  /* 同步请求 *********************************************************************** */

  reducers: {
    list(state, action) {
      const rv = {
        ...state,
        ...action.payload,
      };
      return rv;
    },
    listLogs(state, action) {
      console.log('action=', action)
      const rv = {
        ...state,
        logs: action.payload.data,
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
