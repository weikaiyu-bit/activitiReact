import { list, add, update, remove, fetchCommentPage, fetchReplyCommentPage } from './service';

const Model = {
  namespace: 'jobCommentsModel',
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
        const { params } = yield select(state => state.jobCommentsModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *update({ payload, callback }, { call, put, select }) {
      const response = yield call(update, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.jobCommentsModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *remove({ payload, callback }, { call, put, select }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.jobCommentsModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *fetchCommentPage({ payload }, { call, put }) {
      const response = yield call(fetchCommentPage, payload);
      yield put({
        type: 'listComment',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
    *fetchReplyCommentPage({ payload }, { call, put }) {
      const response = yield call(fetchCommentPage, payload);
      yield put({
        type: 'listReplyComment',
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
    listComment(state, action) {
      const rv = {
        ...state,
        listComment: action.payload.data,
        listCommentTotal: action.payload.total,
      };
      return rv;
    },
    listReplyComment(state, action) {
      const rv = {
        ...state,
        listReplyComment: action.payload.data,
      };
      return rv;
    },
  },
};

export default Model;
