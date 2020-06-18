/* eslint-disable max-len */
import { list, add, update, remove, listTrainingPlan, listPfilePersonnel, removeByFileId } from './service';

const Model = {
  namespace: 'trainingRsMemberModel',
  state: {
    trainingRsMemberData: [],
    total: 0,
  },

  /** �첽���� ************************************************************************************* */

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
    *fetchTrainingPlan({ payload }, { call, put }) {
      const response = yield call(listTrainingPlan, payload);
      yield put({
        type: 'listTrainingPlan',
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
        const { params } = yield select(state => state.trainingRsMemberModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *update({ payload, callback }, { call, put, select }) {
      const response = yield call(update, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.trainingRsMemberModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *remove({ payload, callback }, { call, put, select }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.trainingRsMemberModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *removeByFileId({ payload, callback }, { call, put, select }) {
      const response = yield call(removeByFileId, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.trainingRsMemberModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *fetchPersonnel({ payload, callback }, { call, put }) {
      const response = yield call(listPfilePersonnel, payload);
      if (callback) callback(response);
      yield put({
        type: 'listPfilePersonnel',
        payload: {
          params: payload,
          ...response,
        },
      });
    },
  },

  /** ͬ������ ************************************************************************************* */

  reducers: {
    list(state, action) {
      const rv = {
        ...state,
        trainingRsMemberData: action.payload.data,
        total: action.payload.count,
        limit: action.payload.limit,
        params: action.payload.params,
      };
      return rv;
    },
    listTrainingPlan(state, action) {
      const rv = {
        ...state,
        planData: action.payload.data,
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
    listPfilePersonnel(state, action) {
      const rv = {
        ...state,
        personnelData: action.payload.data,
      };
      return rv;
    },
  },
};

export default Model;
