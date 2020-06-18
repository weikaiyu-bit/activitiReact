import {
  list,
  add,
  update,
  remove,
  find,
  findAnnex,
  findLog,
  findProjectRecord,
  findByProjectId,
} from './service';

const Model = {
  namespace: 'jobProjectsModel',
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
    *add({ payload, callback }, { call, put, select }) {
      const response = yield call(add, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.jobProjectsModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *update({ payload, callback }, { call, put, select }) {
      const response = yield call(update, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.jobProjectsModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *remove({ payload, callback }, { call, put, select }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.jobProjectsModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *fetchProject({ payload }, { call, put }) {
      const response = yield call(find, payload);
      yield put({
        type: 'listProject',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
    *findAnnex({ payload }, { call, put }) {
      const response = yield call(findAnnex, payload);
      yield put({
        type: 'listAnnex',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
    *findLog({ payload }, { call, put }) {
      const response = yield call(findLog, payload);
      yield put({
        type: 'listLog',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
    *findProjectRecord({ payload, callback }, { call, put }) {
      const response = yield call(findProjectRecord, payload);
      if (callback) callback(response);
      console.log(response);
      yield put({
        type: 'listProjectLog',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
    *findByProjectId({ payload, callback }, { call, put }) {
      const response = yield call(findByProjectId, payload);
      if (callback) callback(response);
      yield put({
        type: 'findById',
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
    listProject(state, action) {
      const rv = {
        ...state,
        listProject: action.payload.data,
      };
      return rv;
    },
    listAnnex(state, action) {
      const rv = {
        ...state,
        listAnnex: action.payload.data,
      };
      return rv;
    },
    listLog(state, action) {
      const rv = {
        ...state,
        listLog: action.payload.data,
      };
      return rv;
    },
    listProjectLog(state, action) {
      const rv = {
        ...state,
        listProjectLog: action.payload.data,
      };
      return rv;
    },
    findById(state, action) {
      const rv = {
        ...state,
        findByIdData: action.payload.data,
      };
      return rv;
    },
  },
};

export default Model;
