import {
  list,
  add,
  update,
  remove,
  makeTree,
  findProject,
  findJobMembers,
  findJobRsTaskUser,
  addJobRsTaskUser,
  updataJobRsTaskUser,
  removeJobRsTaskUser,
  listFiles,
  fetchTask,
  makeTreeProject,
} from './service';

const Model = {
  namespace: 'jobTasksModel',
  state: {
    data: [],
    total: 0,
    filesData: [],
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
        const { params } = yield select(state => state.jobTasksModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *update({ payload, callback }, { call, put, select }) {
      const response = yield call(update, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.jobTasksModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *remove({ payload, callback }, { call, put, select }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.jobTasksModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *makeTree({ payload, callback }, { call, put }) {
      const response = yield call(makeTree, payload);
      if (callback) callback(response);
      yield put({
        type: 'tree',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
    *findProject({ payload, callback }, { call, put }) {
      const response = yield call(findProject, payload);
      if (callback) callback(response);
      yield put({
        type: 'project',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
    *findJobMembers({ payload, callback }, { call, put }) {
      const response = yield call(findJobMembers, payload);
      if (callback) callback(response);
      yield put({
        type: 'JobMembers',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
    *findJobRsTaskUser({ payload, callback }, { call, put }) {
      const response = yield call(findJobRsTaskUser, payload);
      if (callback) callback(response);
      yield put({
        type: 'JobRsTaskUser',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
    *addJobRsTaskUser({ payload, callback }, { call, put, select }) {
      const response = yield call(addJobRsTaskUser, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.jobTasksModel);
        yield put({ type: 'findJobRsTaskUser', payload: params });
      }
    },
    *updateJobRsTaskUser({ payload, callback }, { call, put, select }) {
      const response = yield call(updataJobRsTaskUser, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.jobTasksModel);
        yield put({ type: 'findJobRsTaskUser', payload: params });
      }
    },
    *removeJobRsTaskUser({ payload, callback }, { call, put, select }) {
      const response = yield call(removeJobRsTaskUser, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.jobTasksModel);
        yield put({ type: 'findJobRsTaskUser', payload: params });
      }
    },
    *fetchFiles({ payload }, { call, put }) {
      const response = yield call(listFiles, payload);
      yield put({
        type: 'listFiles',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
    *fetchTask({ payload }, { call, put }) {
      const response = yield call(fetchTask, payload);
      yield put({
        type: 'listTask',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
    *makeTreeProject({ payload }, { call, put }) {
      const response = yield call(makeTreeProject, payload);
      yield put({
        type: 'listTreeProject',
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
    tree(state, action) {
      const rv = {
        ...state,
        tree: action.payload.data,
      };
      return rv;
    },
    project(state, action) {
      const rv = {
        ...state,
        projectData: action.payload.data,
      };
      return rv;
    },
    JobMembers(state, action) {
      const rv = {
        ...state,
        jobMembers: action.payload.data,
      };
      return rv;
    },
    JobRsTaskUser(state, action) {
      const rv = {
        ...state,
        JobRsTaskUser: action.payload.data,
      };
      return rv;
    },
    listFiles(state, action) {
      const rv = {
        ...state,
        filesData: action.payload.data,
        filesTotal: action.payload.total,
        filesParams: action.payload.params,
      };
      return rv;
    },
    listTask(state, action) {
      const rv = {
        ...state,
        allTaskData: action.payload.data,
      };
      return rv;
    },
    listTreeProject(state, action) {
      const rv = {
        ...state,
        treeProjectData: action.payload.data,
      };
      return rv;
    },
  },
};

export default Model;
