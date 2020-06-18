import {
  list,
  add,
  update,
  remove,
  listFiles,
  addFile,
  removeFile,
  listComments,
  taskTree,
  projectList,
  membersList,
  listContacts,
  listOrgOrg,
  listOrgPerson,
  membersEditList,
} from './service';
import utils from '../../../dtsea/common/utils';

const Model = {
  namespace: 'myJobsModel',
  state: {
    data: [],
    total: 0,
    filesData: [],
    commentsData: [],
    treeData: [],
    projectData: [],
    membersData: [],
    orgTree: [],
    orgData: [],
    membersEditData: [],
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
    *fetchFiles({ payload, callback }, { call, put }) {
      const response = yield call(listFiles, payload);
      if (callback) callback(response);
      yield put({
        type: 'listFiles',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
    *addFile({ payload, callback }, { call, put, select }) {
      const response = yield call(addFile, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.jobTasksModel);
        yield put({ type: 'fetchFiles', payload: params });
      }
    },
    *removeFile({ payload, callback }, { call, put, select }) {
      const response = yield call(removeFile, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.jobTasksModel);
        yield put({ type: 'fetchFiles', payload: params });
      }
    },
    *fetchComments({ payload, callback }, { call, put }) {
      const response = yield call(listComments, payload);
      if (callback) callback(response);
      yield put({
        type: 'listComments',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
    *fetchTaskTree({ payload, callback }, { call, put }) {
      const response = yield call(taskTree, payload);
      if (callback) callback(response);
      yield put({
        type: 'listTree',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
    *fetchProjects({ payload }, { call, put }) {
      const response = yield call(projectList, payload);
      yield put({
        type: 'listProject',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
    *fetchMembers({ payload }, { call, put }) {
      const response = yield call(membersList, payload);
      yield put({
        type: 'listMember',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
    *fetchEditMembers({ payload }, { call, put }) {
      const response = yield call(membersEditList, payload);
      yield put({
        type: 'listEditMember',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
    *fetchContacts({ payload }, { call, put }) {
      const response = yield call(listContacts, payload);
      yield put({
        type: 'listContacts',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
    *fetchOrgOrg({ payload }, { call, put }) {
      const response = yield call(listOrgOrg, payload);
      yield put({
        type: 'listOrgOrg',
        payload: {
          params: payload, // 把查询参数存起来，用于自动刷新列表
          ...response, // 把查询结果存储起来
        },
      });
    },
    *fetchOrgPerson({ payload }, { call, put }) {
      const response = yield call(listOrgPerson, payload);
      yield put({
        type: 'listOrgPerson',
        payload: {
          params: payload, // 把查询参数存起来，用于自动刷新列表
          ...response, // 把查询结果存储起来
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
    listFiles(state, action) {
      const rv = {
        ...state,
        filesData: action.payload.data,
        filesTotal: action.payload.total,
        filesParams: action.payload.params,
      };
      return rv;
    },
    listComments(state, action) {
      const rv = {
        ...state,
        commentsData: action.payload.data,
        commentsTotal: action.payload.total,
        commentsParams: action.payload.params,
      };
      return rv;
    },
    listTree(state, action) {
      const rv = {
        ...state,
        treeParams: action.payload.params,
        treeTotal: action.payload.total,
        treeData: action.payload.data,
      };
      return rv;
    },
    listProject(state, action) {
      const rv = {
        ...state,
        projectData: action.payload.data,
      };
      return rv;
    },
    listMember(state, action) {
      const rv = {
        ...state,
        membersData: action.payload.data,
      };
      return rv;
    },
    listEditMember(state, action) {
      const rv = {
        ...state,
        membersEditData: action.payload.data,
      };
      return rv;
    },
    listContacts(state, action) {
      const rv = {
        ...state,
        contactsData: action.payload.data,
        contactsTotal: action.payload.total,
      };
      return rv;
    },
    listOrgOrg(state, action) {
      const rv = {
        ...state,
        orgData: action.payload.data,
        orgTree: utils.listToTree(action.payload.data),
      };
      return rv;
    },
    listOrgPerson(state, action) {
      const rv = {
        ...state,
        personTotal: action.payload.total,
        personData: action.payload.data,
      };
      return rv;
    },
  },
};

export default Model;
