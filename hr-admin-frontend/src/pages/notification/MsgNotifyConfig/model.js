import { list, add, update, remove, find, findAll, findAction, listTargetTypes } from './service';

const Model = {
  namespace: 'msgNotifyConfigModel',
  state: {
    data: [],
    total: 0,
  },

  /* 异步请求 *************************************************** */

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(list, payload);
      //   const response2 = yield call(listTargetTypes, payload);
      // const targetTypes = response2.data;
      yield put({
        type: 'list',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
    *find({ payload, callback }, { call, put }) {
      const response = yield call(find, payload);
      if (callback) callback(response);
      yield put({
        type: 'listFind',
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
        const { params } = yield select(state => state.msgNotifyConfigModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *update({ payload, callback }, { call, put, select }) {
      const response = yield call(update, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.msgNotifyConfigModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *remove({ payload, callback }, { call, put, select }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.msgNotifyConfigModel);
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
    *findAction({ payload, callback }, { call, put }) {
      const response = yield call(find, payload);
      if (callback) callback(response);
      yield put({
        type: 'findData',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
  },


  /* 同步请求 ********************************************************** */

  reducers: {
    list(state, action) {
      const rv = {
        ...state,
        ...action.payload,
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
        ...action.payload,
      }
      return rv;
    },
    findData(state, action) {
      const rv = {
        ...state,
        findData: action.payload.data,
      };
      return rv;
    },
    listFind(state, action) {
      const rv = {
        ...state,
        listFind: action.payload.data,
      };
      return rv;
    },
  },
};

export default Model;
