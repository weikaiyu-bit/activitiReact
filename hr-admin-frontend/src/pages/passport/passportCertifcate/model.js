import { list, findAll, add, update, remove } from './service';

const Model = {
  namespace: 'passportCertificateModel',
  state: {
    data: [],
    total: 0,
  },

  /** �첽���� ****************************************************************** */

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
    *fetchAll({ payload }, { call, put }) {
      console.log("进入对应mode.js的fetchAll方法");
      const response = yield call(findAll, payload);
      yield put({
        type: 'listAll',
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
        const { params } = yield select(state => state.passportCertificateModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *update({ payload, callback }, { call, put, select }) {
      const response = yield call(update, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.passportCertificateModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *remove({ payload, callback }, { call, put, select }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.passportCertificateModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
  },

  /** ͬ同步方法 **************************************************************************** */

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
    listAll(state, action) {
      console.log("进入对应mode.js的listAll方法！");
      console.log('action', action.payload)
      const rv = {
        ...state,
        certificatesRegData: action.payload.data,
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
