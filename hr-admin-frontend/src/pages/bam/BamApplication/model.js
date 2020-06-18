import { list, add, update, remove } from './service';

const Model = {
  namespace: 'bamApplicationModel',
  state: {
    data: [],
    total: 0,
  },

  /** 异步请求 ************************************************************************************* */

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
    // *tentants({ payload }, { call, put }) {
    //   const response = yield call(tentants, payload);
    //   yield put({
    //     type: 'tentants',
    //     payload: {
    //       params: payload,
    //       ...response,
    //     },
    //   });
    // },
    *add({ payload, callback }, { call, put, select }) {
      const response = yield call(add, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.bamApplicationModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *update({ payload, callback }, { call, put, select }) {
      const response = yield call(update, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.bamApplicationModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *remove({ payload, callback }, { call, put, select }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.bamApplicationModel);
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
        total: action.payload.total,
        limit: action.payload.limit,
        params: action.payload.params,
      };
      return rv;
    },
    // tentants(state, action) {
    //   const rv = {
    //     ...state,
    //     ...action.payload,
    //   };
    //   console.log(rv)
    //   return rv;
    // },
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
