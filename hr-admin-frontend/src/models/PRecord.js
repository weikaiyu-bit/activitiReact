import { list, add, update, remove, recoreCategory, recoreChangeCode } from '@/services/PRecord';
import utils from '@/dtsea/common/utils';

const Model = {
  namespace: 'pfileWorkRecordModel',
  state: {
    data: [],
    total: 0,
  },

  /** 异步请求 **************************************************************************************/

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
        const { params } = yield select(state => state.pfileWorkRecordModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *update({ payload, callback }, { call, put, select }) {
      const response = yield call(update, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.pfileWorkRecordModel);
        yield put({ type: 'fetch', payload: params });
      }
    },
    *remove({ payload, callback }, { call, put, select }) {
      const response = yield call(remove, payload);
      if (callback) callback(response);
      if (response.code === 0) {
        const { params } = yield select(state => state.pfileWorkRecordModel);
        yield put({ type: 'fetch', payload: params });
      }
    },

    // 在职人员异动选拔任用方式
    *fetchOrgCategory({ payload, callback }, { call, put, select }) {
      const response = yield call(recoreCategory, payload);
      yield put({
        type: 'listRecordCategory',
        payload: {
          params: response,
        },
      });
    },
    *fetchLevel({ payload, callback }, { call, put, select }) {
      const response = yield call(recoreCategory, payload);
      yield put({
        type: 'listLevel',
        payload: {
          params: response,
        },
      });
    },

    // 查询在职的数据
    *fetchChangeCode({ payload, callback }, { call, put, select }) {
      const response = yield call(recoreChangeCode, payload);
      yield put({
        type: 'listRecoreChangeCode',
        payload: {
          params: response,
        },
      });
    },
  },

  /** 同步请求 **************************************************************************************/
  reducers: {
    listRecoreChangeCode(state, action) {
      const rv = {
        ...state,
        changeCodeData: action.payload.params.data,
        changeCodeDataTree: utils.dataToTree(action.payload.params.data),
      };
      return rv;
    },
    listRecordCategory(state, action) {
      const rv = {
        ...state,
        recordCategory: action.payload.params.data,
        recordCategoryTree: utils.dataToTree(action.payload.params.data),
      };
      return rv;
    },
    listLevel(state, action) {
      const rv = {
        ...state,
        recordLevel: action.payload.params.data,
        recordLevelTree: utils.dataToTree(action.payload.params.data),
      };
      return rv;
    },

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
  },
};

export default Model;
