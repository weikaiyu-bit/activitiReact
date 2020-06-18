import { add, list, remove, update, getServer } from './service';

const Model = {
  namespace: 'serverModel',
  state: {
    data: [],
    total: 0,
    // page: 1,
    // limit: 10,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      // console.log('payload', payload);
      const response2 = yield call(getServer, payload);
      const response = yield call(list, payload);
      yield put({
        type: 'list',
        payload: {
          params: payload, // 把查询参数存起来，用于自动刷新列表
          ...response2, // 把查询结果存储起来
        },
      });
      // console.log('response', response);
      yield put({
        type: 'list',
        payload: {
          params: payload, // 把查询参数存起来，用于自动刷新列表
          ...response, // 把查询结果存储起来
        },
      });
    },
    *add({ payload, callback }, { call, put, select }) {
      const response = yield call(add, payload);
      if (callback) callback(response);

      if (response.code === 0) {
        // 刷新列表
        const { params } = yield select(state => state.serverModel);
        yield put({ type: 'fetch', payload: params });
      }
    },

    *remove({ payload, callback }, { call, put, select }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);

      if (response.code === 0) {
        // 刷新列表
        const { params } = yield select(state => state.serverModel);
        yield put({ type: 'fetch', payload: params });
      }
    },

    *update({ payload, callback }, { call, put, select }) {
      const response = yield call(update, payload);
      if (callback) callback(response);

      if (response.code === 0) {
        // 刷新列表
        const { params } = yield select(state => state.serverModel);
        yield put({ type: 'fetch', payload: params });
      }
    },

    *getServer({ payload, callback }, { call, put, select }) {
      const response = yield call(getServer, payload);
      if (callback) callback(response);

      if (response.code === 0) {
        // 刷新列表
        const { params } = yield select(state => state.serverModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
  },
  reducers: {
    list(state, action) {
      // 合并state
      const rv = {
        ...state,
        data: action.payload.data,
        total: action.payload.total,
        pageSize: action.payload.pageSize,
        pageNumber: action.payload.pageNumber,
        params: action.payload.params,
      };
      // console.log('rv', rv);
      return rv;
    },

    save(state, action) {
      // 合并state
      const rv = {
        ...state,
        ...action,
      };
      // console.log('save', rv);
      return rv;
    },
  },
};
export default Model;
