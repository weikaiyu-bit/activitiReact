import {
  createAnnounce,
  createRemind,
  createMessage,
  pullAnnounce,
  pullRemind,
  read,
  getUserNotify,
  subscribe,
  cancelSubscription,
  getSubscriptionConfig,
  updateSubscriptionConfig,
  list,
  query,
  getNewestRemind,
} from './service';

const Model = {
  namespace: 'noticeListModel',
  state: {
    data: [],
    total: 0,
    announceType: [],
    remindType: [],
    messageType: [],
  },

  /* 异步请求 ******************************* */

  effects: {
    *fetch ({ payload }, { call, put }) {
      const response = yield call(list, payload);
      yield put({
        type: 'list',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
    *getUserNotice ({ payload }, { call, put }) {
      const response = yield call(getUserNotify, payload);
      yield put({
        type: 'abc',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
    *pullAnnounces ({ payload, callback }, { call, put }) {
      const response = yield call(pullAnnounce, payload);
      if (callback) callback(response);
      yield put({
        type: 'pullAnnounce',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
    *pullRemind ({ payload, callback }, { call, put }) {
      const response = yield call(pullRemind, payload);
      if (callback) callback(response);
      console.log(response);
      yield put({
        type: 'bcd',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
    *read ({ payload }, { call, put }) {
      const response = yield call(read, payload);
      yield put({
        type: 'read',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
    *createAnnounce ({ payload, callback }, { call, put, select }) {
      const response = yield call(createAnnounce, payload);
      if (callback) callback(response);
    },
    *createRemind ({ payload, callback }, { call, put, select }) {
      const response = yield call(createRemind, payload);
      if (callback) callback(response);
    },
    *createMessage ({ payload, callback }, { call, put, select }) {
      const response = yield call(createMessage, payload);
      if (callback) callback(response);
    },
    *subscribe ({ payload, callback }, { call, put, select }) {
      const response = yield call(subscribe, payload);
      if (callback) callback(response);
    },
    *cancelSubscription ({ payload, callback }, { call, put, select }) {
      const response = yield call(cancelSubscription, payload);
      if (callback) callback(response);
    },
    *getSubscriptionConfig ({ payload, callback }, { call, put, select }) {
      const response = yield call(getSubscriptionConfig, payload);
      if (callback) callback(response);
    },
    *updateSubscriptionConfig ({ payload, callback }, { call, put, select }) {
      const response = yield call(updateSubscriptionConfig, payload);
      if (callback) callback(response);
    },
    *getAnnounce ({ payload, callback }, { call, put }) {
      const response = yield call(query, payload);
      // 记录页数
      yield put({
        type: 'notifyType',
        payload: {
          params: payload,
          ...response,
        },
      });
      if (callback) callback(response);
    },
    *getRemind ({ payload, callback }, { call, put }) {
      const response = yield call(query, payload);
      // 记录页数
      yield put({
        type: 'notifyType',
        payload: {
          params: payload,
          ...response,
        },
      });
      if (callback) callback(response);
    },
    *getMessage ({ payload, callback }, { call, put }) {
      const response = yield call(query, payload);
      // 记录页数
      yield put({
        type: 'notifyType',
        payload: {
          params: payload,
          ...response,
        },
      });
      if (callback) callback(response);
    },
    *getNewestRemind ({ payload, callback }, { call }) {
      const response = yield call(getNewestRemind, payload);
      if (callback) callback(response);
    },
  },

  /* 同步请求 ******************************************* */

  reducers: {
    list (state, action) {
      const rv = {
        ...state,
        data: action.payload.data,
        total: action.payload.count,
        limit: action.payload.limit,
        params: action.payload.params,
      };
      return rv;
    },
    abc (state, action) {
      const rv = {
        ...state, ...action.payload,
      };
      return rv;
    },
    bcd (state, action) {
      const rv = {
        ...state,
        data: action.payload.data,
        total: action.payload.count,
        limit: action.payload.limit,
        params: action.payload.params,
      };
      return rv;
    },
    save (state, action) {
      const rv = {
        ...state,
        ...action,
      };
      return rv;
    },
    notifyType (state, action) {
      let notifyType = {};
      switch (action.payload.params.notifyType) {
        case 'announce':
          notifyType = {
            announceType: action.payload.data,
          }
          break;
        case 'remind':
          notifyType = {
            remindType: action.payload.data,
          }
          break;
        case 'message':
          notifyType = {
            messageType: action.payload.data,
          }
          break;
        default:
        // notifyType = null;
      }
      const rv = {
        ...state,
        ...action.payload,
        ...notifyType,
      };
      return rv;
    },
    pullAnnounce (state, action) {
      const rv = {
        ...state,
        announceData: action.payload.data,
      };
      return rv;
    },
  },
};

export default Model;
