/* eslint-disable max-len */
import { list, add, update, remove, listDictData } from './service';

const Model = {
  namespace: 'rtRecommendationFormModel',
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
    // 查询民族
    *fetchNation({ payload }, { call, put }) {
      const response = yield call(listDictData, payload);

      yield put({
        type: 'nation',
        payload: {
          params: response,
        },
      });
    },
    *fetchPoliticalOrientation({ payload }, { call, put }){
      const response = yield call(listDictData, payload);
      yield put({
        type: 'politicalOrientation',
        payload: {
          params: response,
        }
      });
    },
    *add({ payload, callback }, { call, put, select }) {
      const response = yield call(add, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.rtRecommendationFormModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *update({ payload, callback }, { call, put, select }) {
      const response = yield call(update, payload);
      console.log('payload :>> ', payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.rtRecommendationFormModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *remove({ payload, callback }, { call, put, select }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.rtRecommendationFormModel);
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
    nation(state, action) {
      const rv = {
        ...state,
        nationData: action.payload.params.data,
      };
      return rv;
    },
    politicalOrientation(state, action){
      const rv ={
        ...state,
        politicalOrientationData: action.payload.params.data,
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
